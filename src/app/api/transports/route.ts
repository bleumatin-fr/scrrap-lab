import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Transport from "./Transport";

export async function GET(request: NextRequest) {
  await connect();
  let filters = {};

  if (request.nextUrl.searchParams.has("mode")) {
    filters = { ...filters, mode: request.nextUrl.searchParams.get("mode") };
  }
  const data = await Transport.find(filters);
  const count = await Transport.countDocuments();
  return NextResponse.json(data, {
    headers: [["x-total-count", count.toString()]],
  });
}

export async function POST(request: NextRequest) {
  await connect();
  const { distance, mode, passengers, weight } = await request.json();
  const data = await Transport.create({
    distance,
    mode,
    passengers,
    weight,
  });
  return NextResponse.json(data);
}
