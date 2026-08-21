use solana_program::program_error::ProgramError;

#[repr(u32)]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum LaunchpadError {
    InvalidInstruction = 0,
    InvalidAccountOwner = 1,
    InvalidAuthority = 2,
    AuthorityMustSign = 3,
    InvalidState = 4,
    SerializationFailed = 5,
    AlreadyInitialized = 6,
    InvalidTransition = 7,
}

impl From<LaunchpadError> for ProgramError {
    fn from(value: LaunchpadError) -> Self { ProgramError::Custom(value as u32) }
}
