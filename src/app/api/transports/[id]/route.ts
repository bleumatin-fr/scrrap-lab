import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Transport from "../Transport";
import { NextApiRequest } from "next";

export async function GET(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const document = await Transport.findOne({
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
    mode,
    consumption,
    distance,
    weight,
    passengers,
    reason,
    from,
    to,
  } = await request.json();
  const updatedDocument = await Transport.findOneAndUpdate(
    {
      _id: params.id,
    },
    {
      $set: {
        date,
        mode,
        consumption,
        distance,
        weight,
        passengers,
        reason,
        from,
        to,
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
  const deletedDocument = await Transport.findOneAndDelete({
    _id: params.id,
  });
  return NextResponse.json(deletedDocument);
}
