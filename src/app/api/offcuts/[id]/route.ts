import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Offcut from "../Offcut";
import formDataToObject from "../formDataToObject";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const document = await Offcut.findOne({
    _id: params.id,
  });
  return NextResponse.json(document);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  const formData = await request.formData();
  let modifications = await formDataToObject(formData);

  const updatedDocument = await Offcut.findOneAndUpdate(
    {
      _id: params.id,
    },
    { $set: modifications },
    { new: true }
  );
  return NextResponse.json(updatedDocument);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  const deletedDocument = await Offcut.findOneAndDelete({
    _id: params.id,
  });
  return NextResponse.json(deletedDocument);
}
