import { NextRequest, NextResponse } from "next/server";
import { getPublicRegistry, publicDataHeaders, stablePublicDataEtag } from "../../../../lib/public-data";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const payload = getPublicRegistry();
  const etag = stablePublicDataEtag(payload);
  const headers = publicDataHeaders(etag);

  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers });
  }

  return NextResponse.json(payload, { status: 200, headers });
}
