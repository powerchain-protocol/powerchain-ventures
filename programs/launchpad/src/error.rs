use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Clone, Copy, Debug, Eq, Error, PartialEq)]
pub enum LaunchpadError {
    #[error("invalid instruction")]
    InvalidInstruction = 1,
    #[error("invalid account")]
    InvalidAccount,
    #[error("invalid program derived address")]
    InvalidPda,
    #[error("invalid authority")]
    InvalidAuthority,
    #[error("invalid fee wallet")]
    InvalidFeeWallet,
    #[error("invalid token program")]
    InvalidTokenProgram,
    #[error("invalid sale timing")]
    InvalidTiming,
    #[error("invalid sale state")]
    InvalidSaleState,
    #[error("sale is paused")]
    SalePaused,
    #[error("sale is not active")]
    SaleNotActive,
    #[error("sale allocation exceeded")]
    AllocationExceeded,
    #[error("invalid service fee")]
    InvalidServiceFee,
    #[error("invalid purchase nonce")]
    InvalidNonce,
    #[error("nothing claimable")]
    NothingClaimable,
    #[error("claim exceeds vested amount")]
    ClaimExceedsVested,
    #[error("arithmetic overflow")]
    ArithmeticOverflow,
    #[error("sale cannot be cancelled")]
    CannotCancel,
    #[error("sale cannot be completed")]
    CannotComplete,
    #[error("account already initialized")]
    AlreadyInitialized,
}

impl From<LaunchpadError> for ProgramError {
    fn from(value: LaunchpadError) -> Self {
        ProgramError::Custom(value as u32)
    }
}
