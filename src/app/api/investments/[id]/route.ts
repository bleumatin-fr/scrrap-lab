import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Investment from "../Investment";
import { handleErrors } from "../../errorHandler";
import authenticate from "../../authentication/authenticate";
import allow from "../../authentication/allow";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["investments.list"]);

    const document = await Investment.findOne({
      _id: params.id,
    });
    return NextResponse.json(document);
  }
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  await authenticate(request);
  await allow(request, ["investments.edit"]);

  const {
    type,
    condition,
    reference,
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
        reference,
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
  await authenticate(request);
  await allow(request, ["investments.delete"]);

  const deletedDocument = await Investment.findOneAndDelete({
    _id: params.id,
  });
  return NextResponse.json(deletedDocument);
}
