import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = rel =>
  fs.readFileSync(
    rel,
    "utf8",
  );

test("program IDL keeps deployment identity unset and canonical fee policy", () => {
  const idl =
    JSON.parse(
      read(
        "programs/launchpad/idl/powerchain-launchpad.json",
      ),
    );

  assert.equal(
    idl.version,
    "1.0.0",
  );
  assert.equal(
    idl.programId,
    null,
  );
  assert.equal(
    idl.constants
      .serviceFeeBps,
    250,
  );
  assert.equal(
    idl.constants
      .canonicalFeeWallet,
    "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy",
  );
  assert.equal(
    idl.instructions.length,
    8,
  );
});

test("purchase enforces stored program identities and buyer-owned destination", () => {
  const source =
    read(
      "programs/launchpad/src/processor.rs",
    );

  assert.match(
    source,
    /sale_state\.fee_wallet\(\) != \*fee_wallet\.key/,
  );
  assert.match(
    source,
    /sale_state\.token_program\(\) != \*token_program\.key/,
  );
  assert.match(
    source,
    /require_token_account_owner\([\s\S]*buyer_token_account[\s\S]*buyer\.key/,
  );
  assert.match(
    source,
    /require_token_account_owner\(vault, token_program, mint\.key, vault_authority\.key\)/,
  );
});

test("claim enforces vault PDA and wallet-owned Token-2022 destination", () => {
  const source =
    read(
      "programs/launchpad/src/processor.rs",
    );

  assert.match(
    source,
    /expected_vault_authority[\s\S]*vault_bump != sale_state\.vault_authority_bump/,
  );
  assert.match(
    source,
    /require_token_account_owner\(destination, token_program, mint\.key, wallet\.key\)/,
  );
});

test("program workspace enables overflow checks in optimized release builds", () => {
  const cargo =
    read(
      "programs/Cargo.toml",
    );

  assert.match(
    cargo,
    /\[profile\.release\]/,
  );
  assert.match(
    cargo,
    /overflow-checks = true/,
  );
  assert.match(
    cargo,
    /lto = "fat"/,
  );
});

test("processor contains fee and timing unit regressions", () => {
  const source =
    read(
      "programs/launchpad/src/processor.rs",
    );

  assert.match(
    source,
    /fee_rounds_up_to_canonical_bps/,
  );
  assert.match(
    source,
    /timing_requires_claim_after_sale_end/,
  );
  assert.match(
    source,
    /vesting_requires_cliff_and_end_order/,
  );
});
