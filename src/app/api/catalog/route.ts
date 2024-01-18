export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { GET as GETOFFCUTS } from "../offcuts/route";

export async function GET(request: NextRequest) {
  return await GETOFFCUTS(request);
}
