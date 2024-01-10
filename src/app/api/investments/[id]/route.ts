import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Investment from "../Investment";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const document = await Investment.findOne({
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
    type,
    condition,
    name,
    weight,
    usagePeriod,
    usageStart,
    quantity,
    meta,
  } = await request.json();
  const updatedDocument = await Investment.findOneAndUpdate(
    {
      _id: params.id,
    },
    {
      $set: {
        type,
        condition,
        name,
        weight,
        usagePeriod,
        usageStart,
        quantity,
        meta,
      },
    },
    { new: true }
  );
  return NextResponse.json(updatedDocument);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const deletedDocument = await Investment.findOneAndDelete({
    _id: params.id,
  });
  return NextResponse.json(deletedDocument);
}
