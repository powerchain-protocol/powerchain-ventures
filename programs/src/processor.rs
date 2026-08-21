use crate::{error::LaunchpadError, instruction::LaunchpadInstruction, state::{LaunchState, LaunchStatus}};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    system_program,
    sysvar::Sysvar,
};

pub struct Processor;

impl Processor {
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
        match LaunchpadInstruction::unpack(input)? {
            LaunchpadInstruction::Initialize { seed } => Self::initialize(program_id, accounts, &seed),
            LaunchpadInstruction::Configure => Self::set_status(program_id, accounts, LaunchStatus::Draft),
            LaunchpadInstruction::MoveToReview => Self::set_status(program_id, accounts, LaunchStatus::Review),
            LaunchpadInstruction::Activate => Self::set_status(program_id, accounts, LaunchStatus::Live),
            LaunchpadInstruction::Pause => Self::set_status(program_id, accounts, LaunchStatus::Paused),
            LaunchpadInstruction::Finalize => Self::set_status(program_id, accounts, LaunchStatus::Ended),
        }
    }

    fn initialize(program_id: &Pubkey, accounts: &[AccountInfo], seed: &[u8]) -> ProgramResult {
        let mut accounts = accounts.iter();
        let launch = next_account_info(&mut accounts)?;
        let authority = next_account_info(&mut accounts)?;
        let system = next_account_info(&mut accounts)?;
        if !authority.is_signer { return Err(LaunchpadError::AuthorityMustSign.into()); }
        if *system.key != system_program::id() { return Err(ProgramError::IncorrectProgramId); }
        let (expected, bump) = Pubkey::find_program_address(&[b"launch", seed], program_id);
        if expected != *launch.key { return Err(ProgramError::InvalidSeeds); }

        if launch.owner == program_id {
            if launch.data_len() < LaunchState::LEN { return Err(ProgramError::AccountDataTooSmall); }
            if let Ok(existing) = LaunchState::try_from_slice(&launch.try_borrow_data()?) {
                if existing.initialized { return Err(LaunchpadError::AlreadyInitialized.into()); }
            }
        } else {
            if *launch.owner != system_program::id() || launch.lamports() != 0 {
                return Err(LaunchpadError::InvalidAccountOwner.into());
            }
            let rent = Rent::get()?;
            let lamports = rent.minimum_balance(LaunchState::LEN);
            invoke_signed(
                &system_instruction::create_account(authority.key, launch.key, lamports, LaunchState::LEN as u64, program_id),
                &[authority.clone(), launch.clone(), system.clone()],
                &[&[b"launch", seed, &[bump]]],
            )?;
        }

        if launch.data_len() < LaunchState::LEN { return Err(ProgramError::AccountDataTooSmall); }
        let state = LaunchState { version: LaunchState::VERSION, initialized: true, authority: *authority.key, status: LaunchStatus::Draft };
        state.serialize(&mut &mut launch.try_borrow_mut_data()?[..]).map_err(|_| ProgramError::from(LaunchpadError::SerializationFailed))
    }

    fn transition_allowed(current: LaunchStatus, next: LaunchStatus) -> bool {
        current == next || matches!(
            (current, next),
            (LaunchStatus::Draft, LaunchStatus::Review)
                | (LaunchStatus::Review, LaunchStatus::Live)
                | (LaunchStatus::Live, LaunchStatus::Paused)
                | (LaunchStatus::Paused, LaunchStatus::Live)
                | (LaunchStatus::Live, LaunchStatus::Ended)
                | (LaunchStatus::Paused, LaunchStatus::Ended)
        )
    }

    fn set_status(program_id: &Pubkey, accounts: &[AccountInfo], status: LaunchStatus) -> ProgramResult {
        let mut accounts = accounts.iter();
        let launch = next_account_info(&mut accounts)?;
        let authority = next_account_info(&mut accounts)?;
        if launch.owner != program_id { return Err(LaunchpadError::InvalidAccountOwner.into()); }
        if !authority.is_signer { return Err(LaunchpadError::AuthorityMustSign.into()); }
        let mut data = launch.try_borrow_mut_data()?;
        let mut state = LaunchState::try_from_slice(&data).map_err(|_| LaunchpadError::InvalidState)?;
        if !state.initialized || state.version != LaunchState::VERSION { return Err(LaunchpadError::InvalidState.into()); }
        if state.authority != *authority.key { return Err(LaunchpadError::InvalidAuthority.into()); }
        if !Self::transition_allowed(state.status, status) { return Err(LaunchpadError::InvalidTransition.into()); }
        state.status = status;
        state.serialize(&mut &mut data[..]).map_err(|_| ProgramError::from(LaunchpadError::SerializationFailed))
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lifecycle_transitions_are_explicit() {
        assert!(Processor::transition_allowed(LaunchStatus::Draft, LaunchStatus::Review));
        assert!(Processor::transition_allowed(LaunchStatus::Review, LaunchStatus::Live));
        assert!(Processor::transition_allowed(LaunchStatus::Live, LaunchStatus::Paused));
        assert!(Processor::transition_allowed(LaunchStatus::Paused, LaunchStatus::Live));
        assert!(Processor::transition_allowed(LaunchStatus::Live, LaunchStatus::Ended));
        assert!(!Processor::transition_allowed(LaunchStatus::Draft, LaunchStatus::Live));
        assert!(!Processor::transition_allowed(LaunchStatus::Ended, LaunchStatus::Live));
    }
}
