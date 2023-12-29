import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Entry from "../Entry";
import { NextApiRequest } from "next";

export async function GET(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const document = await Entry.findOne({
    _id: params.id,
  });
  return NextResponse.json(document);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const {
    date,
    transports,
    offcuts,
  } = await request.json();
  const updatedDocument = await Entry.findOneAndUpdate(
    {
      _id: params.id,
    },
    {
      $set: {
        date,
        transports,
        offcuts,
      },
    },
    { new: true }
  );
  return NextResponse.json(updatedDocument);
}

export async function DELETE(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const deletedDocument = await Entry.findOneAndDelete({
    _id: params.id,
  });
  return NextResponse.json(deletedDocument);
}
