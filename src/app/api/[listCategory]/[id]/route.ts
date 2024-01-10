import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import List, { availableLists } from "../List";

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: { listCategory: (typeof availableLists)[number]; id: string } }
) {
  await connect();
  const document = await List.findOne({
    _id: params.id,
    category: params.listCategory,
  });
  return NextResponse.json(document);
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: { listCategory: (typeof availableLists)[number]; id: string } }
) {
  await connect();
  const { key, value, parent } = await request.json();
  const updatedDocument = await List.findOneAndUpdate(
    {
      _id: params.id,
      category: params.listCategory,
    },
    {
      key,
      value,
      parent,
    },
    { new: true }
  );
  return NextResponse.json(updatedDocument);
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: { listCategory: (typeof availableLists)[number]; id: string } }
) {
  await connect();
  const deletedDocument = await List.findOneAndDelete({
    _id: params.id,
    category: params.listCategory,
  });
  return NextResponse.json(deletedDocument);
}
