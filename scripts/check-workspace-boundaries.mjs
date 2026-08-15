import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();
const failures = [];

const SOURCE_EXTENSIONS =
  new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
  ]);

function filesUnder(
  directory,
) {
  if (
    !fs.existsSync(
      directory,
    )
  ) {
    return [];
  }

  const output = [];
  const stack = [
    directory,
  ];

  while (
    stack.length
  ) {
    const current =
      stack.pop();

    for (
      const entry
      of fs.readdirSync(
        current,
        {
          withFileTypes:
            true,
        },
      )
    ) {
      if (
        [
          "node_modules",
          ".next",
          "dist",
          "target",
          ".turbo",
        ].includes(
          entry.name,
        )
      ) {
        continue;
      }

      const full =
        path.join(
          current,
          entry.name,
        );

      if (
        entry.isDirectory()
      ) {
        stack.push(full);
      } else if (
        SOURCE_EXTENSIONS.has(
          path.extname(
            entry.name,
          ),
        )
      ) {
        output.push(full);
      }
    }
  }

  return output;
}

function importsFrom(
  source,
) {
  const values = [];
  const pattern =
    /(?:from\s*|import\s*\(\s*|require\s*\(\s*)["']([^"']+)["']/g;

  for (
    const match
    of source.matchAll(
      pattern,
    )
  ) {
    values.push(
      match[1],
    );
  }

  return values;
}

function resolveRelative(
  file,
  specifier,
) {
  return path.resolve(
    path.dirname(file),
    specifier,
  );
}

const appsRoot =
  path.join(root, "apps");
const packagesRoot =
  path.join(
    root,
    "packages",
  );

for (
  const file
  of filesUnder(
    appsRoot,
  )
) {
  const rel =
    path.relative(
      root,
      file,
    );
  const appName =
    rel.split(
      path.sep,
    )[1];

  const source =
    fs.readFileSync(
      file,
      "utf8",
    );

  for (
    const specifier
    of importsFrom(
      source,
    )
  ) {
    if (
      !specifier.startsWith(
        ".",
      )
    ) {
      continue;
    }

    const resolved =
      resolveRelative(
        file,
        specifier,
      );

    const relative =
      path.relative(
        appsRoot,
        resolved,
      );

    if (
      !relative.startsWith(
        "..",
      )
    ) {
      const targetApp =
        relative.split(
          path.sep,
        )[0];

      if (
        targetApp &&
        targetApp !==
          appName
      ) {
        failures.push(
          `${rel} reaches into apps/${targetApp} via ${specifier}; use a workspace package or API boundary`,
        );
      }
    }
  }
}

for (
  const file
  of filesUnder(
    packagesRoot,
  )
) {
  const rel =
    path.relative(
      root,
      file,
    );
  const source =
    fs.readFileSync(
      file,
      "utf8",
    );

  for (
    const specifier
    of importsFrom(
      source,
    )
  ) {
    if (
      !specifier.startsWith(
        ".",
      )
    ) {
      continue;
    }

    const resolved =
      resolveRelative(
        file,
        specifier,
      );

    const relativeToApps =
      path.relative(
        appsRoot,
        resolved,
      );

    if (
      !relativeToApps.startsWith(
        "..",
      )
    ) {
      failures.push(
        `${rel} imports application internals via ${specifier}`,
      );
    }
  }
}

for (
  const forbidden
  of [
    "payload",
    "apps/payload",
  ]
) {
  if (
    fs.existsSync(
      path.join(
        root,
        forbidden,
      ),
    )
  ) {
    failures.push(
      `forbidden application layer exists: ${forbidden}`,
    );
  }
}

const expectedApps =
  new Map([
    [
      "frontend",
      "@powerchain/launchpad-frontend",
    ],
    [
      "backend",
      "@powerchain/launchpad-backend",
    ],
    [
      "checkout",
      "@powerchain/launchpad-checkout",
    ],
    [
      "mobile",
      "@powerchain/launchpad-mobile",
    ],
  ]);

for (
  const [
    directory,
    packageName,
  ]
  of expectedApps
) {
  const packagePath =
    path.join(
      appsRoot,
      directory,
      "package.json",
    );

  if (
    !fs.existsSync(
      packagePath,
    )
  ) {
    failures.push(
      `missing apps/${directory}/package.json`,
    );
    continue;
  }

  const pkg =
    JSON.parse(
      fs.readFileSync(
        packagePath,
        "utf8",
      ),
    );

  if (
    pkg.name !==
    packageName
  ) {
    failures.push(
      `apps/${directory} package name must be ${packageName}`,
    );
  }
}

console.log(
  JSON.stringify(
    {
      ok:
        failures.length ===
        0,
      appCount:
        expectedApps.size,
      failures,
    },
    null,
    2,
  ),
);

if (
  failures.length
) {
  process.exit(1);
}
