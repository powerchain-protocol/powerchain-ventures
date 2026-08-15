use std::str::FromStr;

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    system_program,
    sysvar::Sysvar,
};
use spl_token_2022::instruction::{set_authority, transfer_checked, AuthorityType};

use crate::{
    error::LaunchpadError,
    instruction::{ClaimArgs, InitializeSaleArgs, LaunchpadInstruction, PurchaseArgs, UpdateTimingArgs},
    state::{ParticipantState, SaleState, SaleStatus, PARTICIPANT_SEED, SALE_SEED, VAULT_AUTHORITY_SEED},
    BPS_DENOMINATOR, CANONICAL_FEE_WALLET, PROGRAM_VERSION, SERVICE_FEE_BPS,
};

pub struct Processor;

impl Processor {
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], data: &[u8]) -> ProgramResult {
        let instruction = LaunchpadInstruction::try_from_slice(data)
            .map_err(|_| ProgramError::from(LaunchpadError::InvalidInstruction))?;
        match instruction {
            LaunchpadInstruction::InitializeSale(args) => Self::initialize_sale(program_id, accounts, args),
            LaunchpadInstruction::UpdateTiming(args) => Self::update_timing(program_id, accounts, args),
            LaunchpadInstruction::SetPaused { paused } => Self::set_paused(program_id, accounts, paused),
            LaunchpadInstruction::Purchase(args) => Self::purchase(program_id, accounts, args),
            LaunchpadInstruction::Claim(args) => Self::claim(program_id, accounts, args),
            LaunchpadInstruction::CancelSale => Self::cancel(program_id, accounts),
            LaunchpadInstruction::CompleteSale => Self::complete(program_id, accounts),
            LaunchpadInstruction::AdoptVaultAuthority => Self::adopt_vault_authority(program_id, accounts),
        }
    }

    fn initialize_sale(program_id: &Pubkey, accounts: &[AccountInfo], args: InitializeSaleArgs) -> ProgramResult {
        let ai = &mut accounts.iter();
        let creator = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        let mint = next_account_info(ai)?;
        let vault = next_account_info(ai)?;
        let vault_authority = next_account_info(ai)?;
        let payment_receiver = next_account_info(ai)?;
        let fee_wallet = next_account_info(ai)?;
        let token_program = next_account_info(ai)?;
        let system = next_account_info(ai)?;

        require_signer(creator)?;
        require_system_program(system)?;
        require_token_program(token_program)?;
        require_fee_wallet(fee_wallet)?;
        require_token_mint_owner(mint, token_program)?;
        require_token_account_mint(vault, token_program, mint.key)?;
        if Pubkey::new_from_array(args.quote_authority) == Pubkey::default() { return Err(LaunchpadError::InvalidAuthority.into()); }
        validate_timing(&args)?;
        if args.allocation_base_units == 0 || args.price_usd_micros == 0 || args.min_purchase_usd_micros == 0 || args.max_purchase_usd_micros < args.min_purchase_usd_micros {
            return Err(LaunchpadError::InvalidSaleState.into());
        }

        let (expected_sale, bump) = Pubkey::find_program_address(
            &[SALE_SEED, creator.key.as_ref(), mint.key.as_ref(), &args.sale_seed],
            program_id,
        );
        if expected_sale != *sale.key { return Err(LaunchpadError::InvalidPda.into()); }
        let (expected_vault_authority, vault_bump) = Pubkey::find_program_address(
            &[VAULT_AUTHORITY_SEED, sale.key.as_ref()],
            program_id,
        );
        if expected_vault_authority != *vault_authority.key { return Err(LaunchpadError::InvalidPda.into()); }
        if sale.owner == program_id || !sale.data_is_empty() { return Err(LaunchpadError::AlreadyInitialized.into()); }

        let state = SaleState {
            version: PROGRAM_VERSION,
            bump,
            vault_authority_bump: vault_bump,
            creator: creator.key.to_bytes(),
            mint: mint.key.to_bytes(),
            vault: vault.key.to_bytes(),
            payment_receiver: payment_receiver.key.to_bytes(),
            fee_wallet: fee_wallet.key.to_bytes(),
            token_program: token_program.key.to_bytes(),
            quote_authority: args.quote_authority,
            decimals: args.decimals,
            eligibility: args.eligibility,
            vesting_enabled: args.vesting_enabled,
            delivery_on_claim: args.delivery_on_claim,
            paused: false,
            status: SaleStatus::Active as u8,
            starts_at: args.starts_at,
            ends_at: args.ends_at,
            claim_starts_at: args.claim_starts_at,
            vesting_cliff_at: args.vesting_cliff_at,
            vesting_ends_at: args.vesting_ends_at,
            allocation_base_units: args.allocation_base_units,
            sold_base_units: 0,
            claimed_base_units: 0,
            price_usd_micros: args.price_usd_micros,
            min_purchase_usd_micros: args.min_purchase_usd_micros,
            max_purchase_usd_micros: args.max_purchase_usd_micros,
            purchase_count: 0,
        };
        let encoded = borsh::to_vec(&state).map_err(|_| ProgramError::InvalidInstructionData)?;
        let rent = Rent::get()?;
        let lamports = rent.minimum_balance(encoded.len());
        invoke_signed(
            &system_instruction::create_account(creator.key, sale.key, lamports, encoded.len() as u64, program_id),
            &[creator.clone(), sale.clone(), system.clone()],
            &[&[SALE_SEED, creator.key.as_ref(), mint.key.as_ref(), &args.sale_seed, &[bump]]],
        )?;
        sale.data.borrow_mut()[..encoded.len()].copy_from_slice(&encoded);
        solana_program::msg!("PowerChain: sale initialized");
        Ok(())
    }

    fn update_timing(program_id: &Pubkey, accounts: &[AccountInfo], args: UpdateTimingArgs) -> ProgramResult {
        let ai = &mut accounts.iter();
        let creator = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        require_signer(creator)?;
        let mut state = load_sale(program_id, sale)?;
        if state.creator() != *creator.key || state.sold_base_units != 0 { return Err(LaunchpadError::InvalidAuthority.into()); }
        validate_timing_values(args.starts_at, args.ends_at, args.claim_starts_at, args.vesting_cliff_at, args.vesting_ends_at, state.vesting_enabled)?;
        if Clock::get()?.unix_timestamp >= state.starts_at { return Err(LaunchpadError::InvalidTiming.into()); }
        state.starts_at = args.starts_at;
        state.ends_at = args.ends_at;
        state.claim_starts_at = args.claim_starts_at;
        state.vesting_cliff_at = args.vesting_cliff_at;
        state.vesting_ends_at = args.vesting_ends_at;
        save(sale, &state)
    }

    fn set_paused(program_id: &Pubkey, accounts: &[AccountInfo], paused: bool) -> ProgramResult {
        let ai = &mut accounts.iter();
        let creator = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        require_signer(creator)?;
        let mut state = load_sale(program_id, sale)?;
        if state.creator() != *creator.key { return Err(LaunchpadError::InvalidAuthority.into()); }
        if matches!(state.status()?, SaleStatus::Cancelled | SaleStatus::Completed) { return Err(LaunchpadError::InvalidSaleState.into()); }
        state.paused = paused;
        save(sale, &state)
    }

    fn adopt_vault_authority(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let ai = &mut accounts.iter();
        let current_authority = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        let vault = next_account_info(ai)?;
        let vault_authority = next_account_info(ai)?;
        let token_program = next_account_info(ai)?;
        require_signer(current_authority)?;
        require_token_program(token_program)?;
        let state = load_sale(program_id, sale)?;
        if state.vault() != *vault.key || state.token_program() != *token_program.key {
            return Err(LaunchpadError::InvalidAccount.into());
        }
        require_token_account_owner(vault, token_program, &state.mint(), current_authority.key)?;
        let (expected, _) = Pubkey::find_program_address(&[VAULT_AUTHORITY_SEED, sale.key.as_ref()], program_id);
        if expected != *vault_authority.key { return Err(LaunchpadError::InvalidPda.into()); }
        let ix = set_authority(
            token_program.key,
            vault.key,
            Some(vault_authority.key),
            AuthorityType::AccountOwner,
            current_authority.key,
            &[],
        )?;
        invoke(&ix, &[vault.clone(), current_authority.clone(), token_program.clone()])?;
        solana_program::msg!("PowerChain: vault authority adopted");
        Ok(())
    }

    fn purchase(program_id: &Pubkey, accounts: &[AccountInfo], args: PurchaseArgs) -> ProgramResult {
        let ai = &mut accounts.iter();
        let buyer = next_account_info(ai)?;
        let quote_authority = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        let participant = next_account_info(ai)?;
        let vault = next_account_info(ai)?;
        let vault_authority = next_account_info(ai)?;
        let buyer_token_account = next_account_info(ai)?;
        let mint = next_account_info(ai)?;
        let payment_receiver = next_account_info(ai)?;
        let fee_wallet = next_account_info(ai)?;
        let token_program = next_account_info(ai)?;
        let system = next_account_info(ai)?;
        require_signer(buyer)?;
        require_signer(quote_authority)?;
        require_token_program(token_program)?;
        require_system_program(system)?;
        require_fee_wallet(fee_wallet)?;
        require_token_mint_owner(mint, token_program)?;
        require_token_account_mint(vault, token_program, mint.key)?;

        let mut sale_state = load_sale(program_id, sale)?;
        require_active_sale(&sale_state)?;
        if sale_state.quote_authority() != *quote_authority.key {
            return Err(LaunchpadError::InvalidAuthority.into());
        }
        if sale_state.vault() != *vault.key
            || sale_state.mint() != *mint.key
            || sale_state.payment_receiver() != *payment_receiver.key
            || sale_state.fee_wallet() != *fee_wallet.key
            || sale_state.token_program() != *token_program.key
        {
            return Err(LaunchpadError::InvalidAccount.into());
        }
        if !sale_state.delivery_on_claim {
            require_token_account_owner(
                buyer_token_account,
                token_program,
                mint.key,
                buyer.key,
            )?;
        }
        let (expected_vault_authority, vault_bump) = Pubkey::find_program_address(&[VAULT_AUTHORITY_SEED, sale.key.as_ref()], program_id);
        if expected_vault_authority != *vault_authority.key || vault_bump != sale_state.vault_authority_bump { return Err(LaunchpadError::InvalidPda.into()); }
        require_token_account_owner(vault, token_program, mint.key, vault_authority.key)?;
        if args.token_amount_base_units == 0 || args.payment_lamports == 0 { return Err(LaunchpadError::InvalidInstruction.into()); }
        let expected_fee = ceil_bps(args.payment_lamports, SERVICE_FEE_BPS)?;
        if expected_fee != args.service_fee_lamports { return Err(LaunchpadError::InvalidServiceFee.into()); }
        let new_sold = sale_state.sold_base_units.checked_add(args.token_amount_base_units).ok_or(LaunchpadError::ArithmeticOverflow)?;
        if new_sold > sale_state.allocation_base_units { return Err(LaunchpadError::AllocationExceeded.into()); }

        let (expected_participant, participant_bump) = Pubkey::find_program_address(
            &[PARTICIPANT_SEED, sale.key.as_ref(), buyer.key.as_ref()],
            program_id,
        );
        if expected_participant != *participant.key { return Err(LaunchpadError::InvalidPda.into()); }
        let mut participant_state = if participant.owner == program_id && !participant.data_is_empty() {
            load_participant(program_id, participant)?
        } else {
            let fresh = ParticipantState::new(participant_bump, sale.key, buyer.key);
            create_participant(program_id, buyer, participant, system, sale.key, &fresh)?;
            fresh
        };
        if Pubkey::new_from_array(participant_state.wallet) != *buyer.key || Pubkey::new_from_array(participant_state.sale) != *sale.key {
            return Err(LaunchpadError::InvalidAccount.into());
        }
        let expected_nonce = participant_state.purchase_nonce.checked_add(1).ok_or(LaunchpadError::ArithmeticOverflow)?;
        if args.purchase_nonce != expected_nonce { return Err(LaunchpadError::InvalidNonce.into()); }

        invoke(&system_instruction::transfer(buyer.key, payment_receiver.key, args.payment_lamports), &[buyer.clone(), payment_receiver.clone(), system.clone()])?;
        invoke(&system_instruction::transfer(buyer.key, fee_wallet.key, args.service_fee_lamports), &[buyer.clone(), fee_wallet.clone(), system.clone()])?;

        if !sale_state.delivery_on_claim {
            transfer_from_vault(
                token_program,
                vault,
                mint,
                buyer_token_account,
                vault_authority,
                sale.key,
                sale_state.vault_authority_bump,
                args.token_amount_base_units,
                sale_state.decimals,
            )?;
        }

        participant_state.purchased_base_units = participant_state.purchased_base_units.checked_add(args.token_amount_base_units).ok_or(LaunchpadError::ArithmeticOverflow)?;
        participant_state.payment_lamports = participant_state.payment_lamports.checked_add(args.payment_lamports).ok_or(LaunchpadError::ArithmeticOverflow)?;
        participant_state.purchase_nonce = args.purchase_nonce;
        sale_state.sold_base_units = new_sold;
        sale_state.purchase_count = sale_state.purchase_count.checked_add(1).ok_or(LaunchpadError::ArithmeticOverflow)?;
        save(participant, &participant_state)?;
        save(sale, &sale_state)?;
        solana_program::msg!("PowerChain: purchase recorded nonce={}", args.purchase_nonce);
        Ok(())
    }

    fn claim(program_id: &Pubkey, accounts: &[AccountInfo], args: ClaimArgs) -> ProgramResult {
        let ai = &mut accounts.iter();
        let wallet = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        let participant = next_account_info(ai)?;
        let vault = next_account_info(ai)?;
        let vault_authority = next_account_info(ai)?;
        let destination = next_account_info(ai)?;
        let mint = next_account_info(ai)?;
        let token_program = next_account_info(ai)?;
        require_signer(wallet)?;
        require_token_program(token_program)?;
        require_token_mint_owner(mint, token_program)?;
        require_token_account_mint(vault, token_program, mint.key)?;
        let mut sale_state = load_sale(program_id, sale)?;
        if !sale_state.delivery_on_claim || sale_state.paused || matches!(sale_state.status()?, SaleStatus::Cancelled | SaleStatus::Completed) {
            return Err(LaunchpadError::InvalidSaleState.into());
        }
        let mut participant_state = load_participant(program_id, participant)?;
        if Pubkey::new_from_array(participant_state.wallet) != *wallet.key || Pubkey::new_from_array(participant_state.sale) != *sale.key {
            return Err(LaunchpadError::InvalidAccount.into());
        }
        if sale_state.vault() != *vault.key
            || sale_state.mint() != *mint.key
            || sale_state.token_program() != *token_program.key
        {
            return Err(LaunchpadError::InvalidAccount.into());
        }
        let (expected_vault_authority, vault_bump) = Pubkey::find_program_address(
            &[VAULT_AUTHORITY_SEED, sale.key.as_ref()],
            program_id,
        );
        if expected_vault_authority != *vault_authority.key
            || vault_bump != sale_state.vault_authority_bump
        {
            return Err(LaunchpadError::InvalidPda.into());
        }
        require_token_account_owner(vault, token_program, mint.key, vault_authority.key)?;
        require_token_account_owner(destination, token_program, mint.key, wallet.key)?;
        let now = Clock::get()?.unix_timestamp;
        let vested = vested_amount(&sale_state, participant_state.purchased_base_units, now)?;
        let available = vested.saturating_sub(participant_state.claimed_base_units);
        if available == 0 { return Err(LaunchpadError::NothingClaimable.into()); }
        if args.amount_base_units == 0 || args.amount_base_units > available { return Err(LaunchpadError::ClaimExceedsVested.into()); }
        transfer_from_vault(token_program, vault, mint, destination, vault_authority, sale.key, sale_state.vault_authority_bump, args.amount_base_units, sale_state.decimals)?;
        participant_state.claimed_base_units = participant_state.claimed_base_units.checked_add(args.amount_base_units).ok_or(LaunchpadError::ArithmeticOverflow)?;
        sale_state.claimed_base_units = sale_state.claimed_base_units.checked_add(args.amount_base_units).ok_or(LaunchpadError::ArithmeticOverflow)?;
        save(participant, &participant_state)?;
        save(sale, &sale_state)?;
        solana_program::msg!("PowerChain: claim delivered");
        Ok(())
    }

    fn cancel(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let ai = &mut accounts.iter();
        let creator = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        require_signer(creator)?;
        let mut state = load_sale(program_id, sale)?;
        if state.creator() != *creator.key { return Err(LaunchpadError::InvalidAuthority.into()); }
        if state.sold_base_units != 0 || matches!(state.status()?, SaleStatus::Cancelled | SaleStatus::Completed) { return Err(LaunchpadError::CannotCancel.into()); }
        state.status = SaleStatus::Cancelled as u8;
        state.paused = true;
        save(sale, &state)
    }

    fn complete(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let ai = &mut accounts.iter();
        let creator = next_account_info(ai)?;
        let sale = next_account_info(ai)?;
        require_signer(creator)?;
        let mut state = load_sale(program_id, sale)?;
        if state.creator() != *creator.key { return Err(LaunchpadError::InvalidAuthority.into()); }
        let now = Clock::get()?.unix_timestamp;
        let claims_complete = !state.delivery_on_claim || state.claimed_base_units == state.sold_base_units;
        if now < state.ends_at || !claims_complete || matches!(state.status()?, SaleStatus::Cancelled | SaleStatus::Completed) {
            return Err(LaunchpadError::CannotComplete.into());
        }
        state.status = SaleStatus::Completed as u8;
        state.paused = true;
        save(sale, &state)
    }
}

fn require_signer(account: &AccountInfo) -> ProgramResult {
    if !account.is_signer { return Err(ProgramError::MissingRequiredSignature); }
    Ok(())
}

fn require_token_program(account: &AccountInfo) -> ProgramResult {
    if *account.key != spl_token_2022::id() { return Err(LaunchpadError::InvalidTokenProgram.into()); }
    Ok(())
}

fn require_token_mint_owner(mint: &AccountInfo, token_program: &AccountInfo) -> ProgramResult {
    if mint.owner != token_program.key { return Err(LaunchpadError::InvalidTokenProgram.into()); }
    Ok(())
}

fn require_token_account_mint(account: &AccountInfo, token_program: &AccountInfo, mint: &Pubkey) -> ProgramResult {
    if account.owner != token_program.key { return Err(LaunchpadError::InvalidTokenProgram.into()); }
    let data = account.try_borrow_data()?;
    if data.len() < 64 || &data[..32] != mint.as_ref() {
        return Err(LaunchpadError::InvalidAccount.into());
    }
    Ok(())
}

fn require_token_account_owner(
    account: &AccountInfo,
    token_program: &AccountInfo,
    mint: &Pubkey,
    owner: &Pubkey,
) -> ProgramResult {
    require_token_account_mint(account, token_program, mint)?;
    let data = account.try_borrow_data()?;
    if &data[32..64] != owner.as_ref() {
        return Err(LaunchpadError::InvalidAuthority.into());
    }
    Ok(())
}

fn require_system_program(account: &AccountInfo) -> ProgramResult {
    if *account.key != system_program::id() { return Err(LaunchpadError::InvalidAccount.into()); }
    Ok(())
}

fn require_fee_wallet(account: &AccountInfo) -> ProgramResult {
    let expected = Pubkey::from_str(CANONICAL_FEE_WALLET).map_err(|_| LaunchpadError::InvalidFeeWallet)?;
    if *account.key != expected { return Err(LaunchpadError::InvalidFeeWallet.into()); }
    Ok(())
}

fn validate_timing(args: &InitializeSaleArgs) -> ProgramResult {
    validate_timing_values(args.starts_at, args.ends_at, args.claim_starts_at, args.vesting_cliff_at, args.vesting_ends_at, args.vesting_enabled)
}

fn validate_timing_values(starts_at: i64, ends_at: i64, claim_starts_at: i64, cliff_at: i64, vesting_ends_at: i64, vesting: bool) -> ProgramResult {
    if starts_at >= ends_at || claim_starts_at < ends_at { return Err(LaunchpadError::InvalidTiming.into()); }
    if vesting && (cliff_at < claim_starts_at || vesting_ends_at < cliff_at) { return Err(LaunchpadError::InvalidTiming.into()); }
    Ok(())
}

fn require_active_sale(state: &SaleState) -> ProgramResult {
    state.assert_version()?;
    if state.paused { return Err(LaunchpadError::SalePaused.into()); }
    if state.status()? != SaleStatus::Active { return Err(LaunchpadError::InvalidSaleState.into()); }
    let now = Clock::get()?.unix_timestamp;
    if now < state.starts_at || now >= state.ends_at { return Err(LaunchpadError::SaleNotActive.into()); }
    Ok(())
}

fn load_sale(program_id: &Pubkey, account: &AccountInfo) -> Result<SaleState, ProgramError> {
    if account.owner != program_id { return Err(LaunchpadError::InvalidAccount.into()); }
    let state = SaleState::try_from_slice(&account.data.borrow()).map_err(|_| ProgramError::InvalidAccountData)?;
    state.assert_version()?;
    Ok(state)
}

fn load_participant(program_id: &Pubkey, account: &AccountInfo) -> Result<ParticipantState, ProgramError> {
    if account.owner != program_id { return Err(LaunchpadError::InvalidAccount.into()); }
    let state = ParticipantState::try_from_slice(&account.data.borrow()).map_err(|_| ProgramError::InvalidAccountData)?;
    if state.version != PROGRAM_VERSION { return Err(LaunchpadError::InvalidSaleState.into()); }
    Ok(state)
}

fn save<T: BorshSerialize>(account: &AccountInfo, value: &T) -> ProgramResult {
    value.serialize(&mut &mut account.data.borrow_mut()[..]).map_err(|_| ProgramError::InvalidAccountData)
}

fn create_participant<'a>(
    program_id: &Pubkey,
    payer: &AccountInfo<'a>,
    participant: &AccountInfo<'a>,
    system: &AccountInfo<'a>,
    sale: &Pubkey,
    state: &ParticipantState,
) -> ProgramResult {
    let encoded = borsh::to_vec(state).map_err(|_| ProgramError::InvalidInstructionData)?;
    let rent = Rent::get()?;
    let wallet = Pubkey::new_from_array(state.wallet);
    invoke_signed(
        &system_instruction::create_account(payer.key, participant.key, rent.minimum_balance(encoded.len()), encoded.len() as u64, program_id),
        &[payer.clone(), participant.clone(), system.clone()],
        &[&[PARTICIPANT_SEED, sale.as_ref(), wallet.as_ref(), &[state.bump]]],
    )?;
    { participant.data.borrow_mut()[..encoded.len()].copy_from_slice(&encoded); Ok(()) }
}

fn transfer_from_vault<'a>(
    token_program: &AccountInfo<'a>,
    vault: &AccountInfo<'a>,
    mint: &AccountInfo<'a>,
    destination: &AccountInfo<'a>,
    vault_authority: &AccountInfo<'a>,
    sale: &Pubkey,
    vault_bump: u8,
    amount: u64,
    decimals: u8,
) -> ProgramResult {
    let ix = transfer_checked(
        token_program.key,
        vault.key,
        mint.key,
        destination.key,
        vault_authority.key,
        &[],
        amount,
        decimals,
    )?;
    invoke_signed(
        &ix,
        &[vault.clone(), mint.clone(), destination.clone(), vault_authority.clone(), token_program.clone()],
        &[&[VAULT_AUTHORITY_SEED, sale.as_ref(), &[vault_bump]]],
    )
}

fn ceil_bps(amount: u64, bps: u64) -> Result<u64, ProgramError> {
    let numerator = amount.checked_mul(bps).ok_or(LaunchpadError::ArithmeticOverflow)?
        .checked_add(BPS_DENOMINATOR - 1).ok_or(LaunchpadError::ArithmeticOverflow)?;
    Ok(numerator / BPS_DENOMINATOR)
}

fn vested_amount(state: &SaleState, total: u64, now: i64) -> Result<u64, ProgramError> {
    if now < state.claim_starts_at { return Ok(0); }
    if !state.vesting_enabled { return Ok(total); }
    if now < state.vesting_cliff_at { return Ok(0); }
    if now >= state.vesting_ends_at || state.vesting_ends_at <= state.claim_starts_at { return Ok(total); }
    let elapsed = now.saturating_sub(state.claim_starts_at) as u128;
    let duration = state.vesting_ends_at.saturating_sub(state.claim_starts_at) as u128;
    let vested = (total as u128).checked_mul(elapsed).ok_or(LaunchpadError::ArithmeticOverflow)? / duration;
    u64::try_from(vested).map_err(|_| LaunchpadError::ArithmeticOverflow.into())
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fee_rounds_up_to_canonical_bps() {
        assert_eq!(ceil_bps(1, SERVICE_FEE_BPS).unwrap(), 1);
        assert_eq!(ceil_bps(40, SERVICE_FEE_BPS).unwrap(), 1);
        assert_eq!(ceil_bps(41, SERVICE_FEE_BPS).unwrap(), 2);
        assert_eq!(ceil_bps(10_000, SERVICE_FEE_BPS).unwrap(), 250);
    }

    #[test]
    fn timing_requires_claim_after_sale_end() {
        assert!(validate_timing_values(
            10,
            20,
            20,
            20,
            20,
            false,
        ).is_ok());

        assert!(validate_timing_values(
            10,
            20,
            19,
            20,
            20,
            false,
        ).is_err());
    }

    #[test]
    fn vesting_requires_cliff_and_end_order() {
        assert!(validate_timing_values(
            10,
            20,
            20,
            25,
            30,
            true,
        ).is_ok());

        assert!(validate_timing_values(
            10,
            20,
            20,
            19,
            30,
            true,
        ).is_err());

        assert!(validate_timing_values(
            10,
            20,
            20,
            30,
            29,
            true,
        ).is_err());
    }
}
