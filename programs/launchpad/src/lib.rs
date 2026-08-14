#![allow(unexpected_cfgs)]

pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
mod entrypoint;

pub use processor::Processor;

/// PowerChain protocol version. The deployed program address is intentionally
/// not compiled into this crate; deployment tooling supplies the real program ID.
pub const PROGRAM_VERSION: u8 = 1;
pub const SERVICE_FEE_BPS: u64 = 250;
pub const BPS_DENOMINATOR: u64 = 10_000;
pub const CANONICAL_FEE_WALLET: &str = "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy";
