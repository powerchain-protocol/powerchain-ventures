import { NextRequest, NextResponse } from "next/server";
import { getPublicPwrcData, tokenDataEtag } from "../../../../lib/token-data";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const payload = getPublicPwrcData();
  const etag = tokenDataEtag(payload);

  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  }

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      ETag: etag,
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      "X-PowerChain-Data-Source": "powerchain-token-data",
    },
  });
}
