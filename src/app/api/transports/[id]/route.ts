import { NextResponse } from "next/server";
import { connect } from "../../db";
import Transport from "../Transport";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connect();
  const data = await Transport.findOne({
    _id: params.id,
  });
  return NextResponse.json(data);
}
