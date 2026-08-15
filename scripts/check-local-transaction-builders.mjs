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

const purchase =
  read(
    "apps/backend/lib/purchase-transaction-builder.ts",
  );
const program =
  read(
    "apps/backend/lib/local-program-transaction-builder.ts",
  );
const claim =
  read(
    "apps/backend/app/api/v1/launchpad/claim/prepare/route.ts",
  );
const lifecycle =
  read(
    "apps/backend/app/api/v1/launchpad/sales/action/prepare/route.ts",
  );
const operations =
  read(
    "apps/backend/app/api/v1/launchpad/program/operations/prepare/route.ts",
  );
const draft =
  read(
    "apps/backend/app/api/v1/launchpad/sales/draft/route.ts",
  );
const ready =
  read(
    "apps/backend/app/api/v1/ready/route.ts",
  );

for (
  const guard
  of [
    "buildPurchaseOperation",
    "partialSign",
    "simulateTransaction",
  ]
) {
  if (
    !purchase.includes(
      guard,
    )
  ) {
    failures.push(
      `purchase builder missing ${guard}`,
    );
  }
}

for (
  const guard
  of [
    "buildLocalClaimTransaction",
    "buildLocalCreatorTransaction",
    "buildLocalSaleActivationTransaction",
    "buildClaimOperation",
    "buildLifecycleOperation",
    "buildPauseOperation",
    "buildTimingOperation",
    "buildSaleActivationOperations",
    "simulateTransaction",
  ]
) {
  if (
    !program.includes(
      guard,
    )
  ) {
    failures.push(
      `local program builder missing ${guard}`,
    );
  }
}

if (
  !claim.includes(
    "buildLocalClaimTransaction",
  ) ||
  claim.includes(
    'buildTransaction("claim"',
  ) ||
  claim.includes(
    "unavailablePlan",
  )
) {
  failures.push(
    "claim prepare must use only the local claim builder",
  );
}

for (
  const [
    label,
    source,
  ]
  of [
    [
      "creator lifecycle",
      lifecycle,
    ],
    [
      "creator program operations",
      operations,
    ],
  ]
) {
  if (
    !source.includes(
      "buildLocalCreatorTransaction",
    ) ||
    source.includes(
      'buildTransaction("sale-action"',
    ) ||
    source.includes(
      "unavailablePlan",
    )
  ) {
    failures.push(
      `${label} must use only the local creator builder`,
    );
  }
}

if (
  !draft.includes(
    "buildLocalSaleActivationTransaction",
  ) ||
  !draft.includes(
    'buildTransaction("sale-activation"',
  )
) {
  failures.push(
    "sale activation must prefer local creator-controlled vault activation and retain delegated-vault fallback",
  );
}

if (
  !draft.includes(
    "cliff>duration",
  )
) {
  failures.push(
    "sale draft must reject vesting cliff beyond vesting duration",
  );
}

if (
  !ready.includes(
    "localTransactionBuilders",
  ) ||
  !ready.includes(
    "delegatedVaultActivation",
  )
) {
  failures.push(
    "readiness must expose local builder and delegated-vault capability state",
  );
}

console.log(
  JSON.stringify(
    {
      ok:
        failures.length ===
        0,
      local: [
        "purchase",
        "claim",
        "creator-lifecycle",
        "pause-resume",
        "update-timing",
        "creator-controlled-sale-activation",
      ],
      optionalExternal: [
        "delegated-vault-sale-activation",
      ],
      failures,
    },
    null,
    2,
  ),
);

if (failures.length) {
  process.exit(1);
}
