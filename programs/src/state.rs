use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[repr(u8)]
#[derive(BorshSerialize, BorshDeserialize, Clone, Copy, Debug, Eq, PartialEq)]
pub enum LaunchStatus {
    Draft = 0,
    Review = 1,
    Live = 2,
    Paused = 3,
    Ended = 4,
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
pub struct LaunchState {
    pub version: u8,
    pub initialized: bool,
    pub authority: Pubkey,
    pub status: LaunchStatus,
}

impl LaunchState {
    pub const VERSION: u8 = 1;
    pub const LEN: usize = 1 + 1 + 32 + 1;
}
