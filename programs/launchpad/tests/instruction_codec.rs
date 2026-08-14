use borsh::{from_slice, to_vec};
use powerchain_launchpad::{
    instruction::{ClaimArgs, LaunchpadInstruction, PurchaseArgs},
    BPS_DENOMINATOR, CANONICAL_FEE_WALLET, PROGRAM_VERSION, SERVICE_FEE_BPS,
};

#[test]
fn protocol_constants_are_stable_for_v1() {
    assert_eq!(PROGRAM_VERSION, 1);
    assert_eq!(SERVICE_FEE_BPS, 250);
    assert_eq!(BPS_DENOMINATOR, 10_000);
    assert_eq!(CANONICAL_FEE_WALLET, "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy");
}

#[test]
fn purchase_instruction_borsh_round_trip_is_stable() {
    let instruction = LaunchpadInstruction::Purchase(PurchaseArgs {
        token_amount_base_units: 5_000_000_000,
        payment_lamports: 1_000_000,
        service_fee_lamports: 25_000,
        purchase_nonce: 7,
    });
    let bytes = to_vec(&instruction).expect("serialize purchase");
    let decoded: LaunchpadInstruction = from_slice(&bytes).expect("deserialize purchase");
    assert_eq!(decoded, instruction);
}

#[test]
fn claim_instruction_borsh_round_trip_is_stable() {
    let instruction = LaunchpadInstruction::Claim(ClaimArgs { amount_base_units: 42 });
    let bytes = to_vec(&instruction).expect("serialize claim");
    let decoded: LaunchpadInstruction = from_slice(&bytes).expect("deserialize claim");
    assert_eq!(decoded, instruction);
}
