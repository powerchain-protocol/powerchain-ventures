use borsh::{BorshDeserialize, BorshSerialize};

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize, PartialEq)]
pub struct InitializeSaleArgs {
    pub sale_seed: [u8; 32],
    pub decimals: u8,
    pub eligibility: u8,
    pub vesting_enabled: bool,
    pub delivery_on_claim: bool,
    pub quote_authority: [u8; 32],
    pub starts_at: i64,
    pub ends_at: i64,
    pub claim_starts_at: i64,
    pub vesting_cliff_at: i64,
    pub vesting_ends_at: i64,
    pub allocation_base_units: u64,
    pub price_usd_micros: u64,
    pub min_purchase_usd_micros: u64,
    pub max_purchase_usd_micros: u64,
}

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize, PartialEq)]
pub struct UpdateTimingArgs {
    pub starts_at: i64,
    pub ends_at: i64,
    pub claim_starts_at: i64,
    pub vesting_cliff_at: i64,
    pub vesting_ends_at: i64,
}

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize, PartialEq)]
pub struct PurchaseArgs {
    pub token_amount_base_units: u64,
    pub payment_lamports: u64,
    pub service_fee_lamports: u64,
    pub purchase_nonce: u64,
}

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize, PartialEq)]
pub struct ClaimArgs {
    pub amount_base_units: u64,
}

/// Borsh enum tag is the first byte and is mirrored by @powerchain/launchpad-program-client.
#[derive(Clone, Debug, BorshDeserialize, BorshSerialize, PartialEq)]
pub enum LaunchpadInstruction {
    InitializeSale(InitializeSaleArgs),
    UpdateTiming(UpdateTimingArgs),
    SetPaused { paused: bool },
    Purchase(PurchaseArgs),
    Claim(ClaimArgs),
    CancelSale,
    CompleteSale,
    AdoptVaultAuthority,
}
