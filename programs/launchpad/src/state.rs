use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{program_error::ProgramError, pubkey::Pubkey};

use crate::{error::LaunchpadError, PROGRAM_VERSION};

pub const SALE_SEED: &[u8] = b"sale";
pub const VAULT_AUTHORITY_SEED: &[u8] = b"vault";
pub const PARTICIPANT_SEED: &[u8] = b"participant";

#[repr(u8)]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SaleStatus {
    Draft = 0,
    Active = 1,
    Cancelled = 2,
    Completed = 3,
}

impl SaleStatus {
    pub fn from_u8(value: u8) -> Result<Self, ProgramError> {
        match value {
            0 => Ok(Self::Draft),
            1 => Ok(Self::Active),
            2 => Ok(Self::Cancelled),
            3 => Ok(Self::Completed),
            _ => Err(LaunchpadError::InvalidSaleState.into()),
        }
    }
}

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize, PartialEq)]
pub struct SaleState {
    pub version: u8,
    pub bump: u8,
    pub vault_authority_bump: u8,
    pub creator: [u8; 32],
    pub mint: [u8; 32],
    pub vault: [u8; 32],
    pub payment_receiver: [u8; 32],
    pub fee_wallet: [u8; 32],
    pub token_program: [u8; 32],
    pub quote_authority: [u8; 32],
    pub decimals: u8,
    pub eligibility: u8,
    pub vesting_enabled: bool,
    pub delivery_on_claim: bool,
    pub paused: bool,
    pub status: u8,
    pub starts_at: i64,
    pub ends_at: i64,
    pub claim_starts_at: i64,
    pub vesting_cliff_at: i64,
    pub vesting_ends_at: i64,
    pub allocation_base_units: u64,
    pub sold_base_units: u64,
    pub claimed_base_units: u64,
    pub price_usd_micros: u64,
    pub min_purchase_usd_micros: u64,
    pub max_purchase_usd_micros: u64,
    pub purchase_count: u64,
}

impl SaleState {
    pub fn creator(&self) -> Pubkey { Pubkey::new_from_array(self.creator) }
    pub fn mint(&self) -> Pubkey { Pubkey::new_from_array(self.mint) }
    pub fn vault(&self) -> Pubkey { Pubkey::new_from_array(self.vault) }
    pub fn status(&self) -> Result<SaleStatus, ProgramError> { SaleStatus::from_u8(self.status) }
    pub fn assert_version(&self) -> Result<(), ProgramError> {
        if self.version != PROGRAM_VERSION { return Err(LaunchpadError::InvalidSaleState.into()); }
        Ok(())
    }
}

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize, PartialEq)]
pub struct ParticipantState {
    pub version: u8,
    pub bump: u8,
    pub sale: [u8; 32],
    pub wallet: [u8; 32],
    pub purchased_base_units: u64,
    pub claimed_base_units: u64,
    pub purchase_nonce: u64,
    pub payment_lamports: u64,
}

impl ParticipantState {
    pub fn new(bump: u8, sale: &Pubkey, wallet: &Pubkey) -> Self {
        Self {
            version: PROGRAM_VERSION,
            bump,
            sale: sale.to_bytes(),
            wallet: wallet.to_bytes(),
            purchased_base_units: 0,
            claimed_base_units: 0,
            purchase_nonce: 0,
            payment_lamports: 0,
        }
    }
}
