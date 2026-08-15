import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 300;

const payload = Object.freeze({
  "schemaVersion": 1,
  "algorithm": "sha256",
  "files": {
    "pwrc.json": "5c84df673dd4654580ed6c7ab89ff7269d6b520c0cc6e894b3a15c66a49ed906",
    "public-registry.json": "5c535800000ddcd895efb8b85705b6bdbd1abf726080def42b0b214677e6e4ed"
  },
  "generatedAt": "2026-08-15T00:00:00.000Z"
});

export async function GET() {
  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "X-PowerChain-Schema-Version": "1",
      "X-PowerChain-Release": "1.0.0",
    },
  });
}
