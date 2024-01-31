export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Metric from "./Metric";
import getInvestmentMetrics from "./getInvestmentMetrics";
import getTransportMetrics from "./getTransportMetrics";
import getExitMetrics from "./getExitMetrics";
import getEntryMetrics from "./getEntryMetrics";
import { handleErrors } from "../errorHandler";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["metrics.list"]);

  const start = new Date(
    request.nextUrl.searchParams.get("start") || "2024-01-01"
  );
  const end = new Date(request.nextUrl.searchParams.get("end") || "2024-12-31");

  const metrics: Metric[] = [
    ...(await getTransportMetrics(start, end)),
    ...(await getInvestmentMetrics(start, end)),
    ...(await getExitMetrics(start, end)),
    ...(await getEntryMetrics(start, end)),
  ].sort((a, b) => a.id.localeCompare(b.id));

  return NextResponse.json(metrics, {
    headers: [["x-total-count", metrics.length.toString()]],
  });
});
