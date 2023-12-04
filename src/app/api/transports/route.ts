import { NextResponse } from "next/server";
import { connect } from "../db";
import Transport from "./Transport";

export async function GET() {
  await connect();
  const data = await Transport.find();
  const count = await Transport.countDocuments();
  return NextResponse.json(
    data,
    { headers: [["x-total-count", count.toString()]] }
  );
}
