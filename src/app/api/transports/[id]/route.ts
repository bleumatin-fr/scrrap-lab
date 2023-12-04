import { NextResponse } from "next/server";
import { connect } from "../../db";
import Transport from "../Transport";
import { NextApiRequest } from "next";

export async function GET(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const data = await Transport.findOne({
    _id: params.id,
  });
  return NextResponse.json(data);
}

export async function PUT(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const data = await Transport.findOneAndUpdate(
    {
      _id: params.id,
    },
    request.body,
    { new: true }
  );
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  await Transport.findOneAndDelete({
    _id: params.id,
  });
  return NextResponse.next();
}