import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();
const failures = [];

const read = rel =>
  fs.readFileSync(
    path.join(root, rel),
    "utf8",
  );

const idl =
  JSON.parse(
    read(
      "programs/launchpad/idl/powerchain-launchpad.json",
    ),
  );

const rustLib =
  read(
    "programs/launchpad/src/lib.rs",
  );
const rustInstruction =
  read(
    "programs/launchpad/src/instruction.rs",
  );
const rustProcessor =
  read(
    "programs/launchpad/src/processor.rs",
  );
const codec =
  read(
    "packages/program-client/src/codec.ts",
  );
const instructions =
  read(
    "packages/program-client/src/instructions.ts",
  );
const review =
  read(
    "packages/program-client/src/review.ts",
  );
const config =
  read(
    "packages/config/src/constants.ts",
  );
const domainFees =
  read(
    "packages/domain/src/fees.ts",
  );

const expected = [
  ["initializeSale", 0],
  ["updateTiming", 1],
  ["setPaused", 2],
  ["purchase", 3],
  ["claim", 4],
  ["cancelSale", 5],
  ["completeSale", 6],
  ["adoptVaultAuthority", 7],
];

for (
  const [name, tag]
  of expected
) {
  const item =
    idl.instructions.find(
      value =>
        value.name === name,
    );

  if (
    !item ||
    item.tag !== tag
  ) {
    failures.push(
      `IDL tag mismatch for ${name}`,
    );
  }

  const tagPattern =
    new RegExp(
      `${name}:\\s*${tag}\\b`,
    );

  if (
    !tagPattern.test(codec)
  ) {
    failures.push(
      `program-client codec tag mismatch for ${name}`,
    );
  }
}

const rustOrder = [
  "InitializeSale",
  "UpdateTiming",
  "SetPaused",
  "Purchase",
  "Claim",
  "CancelSale",
  "CompleteSale",
  "AdoptVaultAuthority",
];

const enumStart =
  rustInstruction.indexOf(
    "pub enum LaunchpadInstruction",
  );
const enumEnd =
  rustInstruction.indexOf(
    "\n}",
    enumStart,
  );
const enumSource =
  enumStart >= 0 &&
  enumEnd > enumStart
    ? rustInstruction.slice(
        enumStart,
        enumEnd,
      )
    : "";

let lastIndex = -1;
for (
  const variant
  of rustOrder
) {
  const current =
    enumSource.indexOf(
      variant,
    );

  if (
    current <= lastIndex
  ) {
    failures.push(
      `Rust instruction enum order mismatch at ${variant}`,
    );
  }

  lastIndex =
    current;
}

for (
  const [source, guard]
  of [
    [
      rustLib,
      "SERVICE_FEE_BPS: u64 = 250",
    ],
    [
      rustLib,
      "BPS_DENOMINATOR: u64 = 10_000",
    ],
    [
      rustLib,
      "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy",
    ],
    [
      config,
      "POWERCHAIN_SERVICE_FEE_BPS = 250",
    ],
    [
      config,
      "POWERCHAIN_SERVICE_FEE_PERCENT = 2.5",
    ],
    [
      domainFees,
      "SERVICE_FEE_BPS = 250n",
    ],
  ]
) {
  if (
    !source.includes(
      guard,
    )
  ) {
    failures.push(
      `fee parity guard missing: ${guard}`,
    );
  }
}

if (
  idl.programId !==
  null
) {
  failures.push(
    "IDL programId must remain null until verified deployment",
  );
}

if (
  idl.constants
    ?.canonicalFeeWallet !==
  "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy"
) {
  failures.push(
    "IDL canonical fee wallet mismatch",
  );
}

if (
  idl.constants
    ?.serviceFeeBps !==
  250
) {
  failures.push(
    "IDL service fee mismatch",
  );
}

function ordered(
  source,
  markers,
  label,
) {
  let cursor = -1;

  for (
    const marker
    of markers
  ) {
    const index =
      source.indexOf(
        marker,
        cursor + 1,
      );

    if (
      index === -1 ||
      index < cursor
    ) {
      failures.push(
        `${label} account order missing ${marker}`,
      );
      return;
    }

    cursor = index;
  }
}

ordered(
  instructions,
  [
    "meta(input.wallet,true,true)",
    "meta(input.quoteAuthorityWallet,true,false)",
    "meta(input.salePda,false,true)",
    "meta(participant.address,false,true)",
    "meta(input.sourceVaultTokenAccount,false,true)",
    "meta(vaultAuthority.address)",
    "meta(input.destinationTokenAccount,false,true)",
    "meta(input.mint)",
    "meta(input.paymentReceiverWallet,false,true)",
    "meta(POWERCHAIN_FEE_WALLET_ADDRESS,false,true)",
    "meta(SOLANA_TOKEN_2022_PROGRAM_ID)",
    "meta(SystemProgram.programId)",
  ],
  "purchase",
);

ordered(
  instructions,
  [
    "meta(input.wallet,true)",
    "meta(input.salePda,false,true)",
    "meta(participant.address,false,true)",
    "meta(input.sourceVaultTokenAccount,false,true)",
    "meta(vaultAuthority.address)",
    "meta(input.destinationTokenAccount,false,true)",
    "meta(input.mint)",
    "meta(SOLANA_TOKEN_2022_PROGRAM_ID)",
  ],
  "claim",
);

for (
  const guard
  of [
    "sale_state.fee_wallet() != *fee_wallet.key",
    "sale_state.token_program() != *token_program.key",
    "require_token_account_owner(vault, token_program, mint.key, vault_authority.key)",
    "require_token_account_owner(destination, token_program, mint.key, wallet.key)",
    "require_token_account_owner(vault, token_program, &state.mint(), current_authority.key)",
  ]
) {
  if (
    !rustProcessor.includes(
      guard,
    )
  ) {
    failures.push(
      `on-chain account invariant missing: ${guard}`,
    );
  }
}

for (
  const label
  of [
    "Buyer wallet",
    "PowerChain quote authority",
    "PowerChain fee wallet",
    "Destination token account",
  ]
) {
  if (
    !review.includes(label)
  ) {
    failures.push(
      `program review label missing: ${label}`,
    );
  }
}

console.log(
  JSON.stringify(
    {
      ok:
        failures.length ===
        0,
      version:
        idl.version,
      instructions:
        idl.instructions.length,
      programId:
        idl.programId,
      failures,
    },
    null,
    2,
  ),
);

if (failures.length) {
  process.exit(1);
}
