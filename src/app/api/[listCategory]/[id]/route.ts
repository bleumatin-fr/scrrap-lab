import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import List, { availableLists } from "../List";
import authenticate from "../../authentication/authenticate";
import allow from "../../authentication/allow";
import { handleErrors } from "../../errorHandler";

export const GET = handleErrors(
  async (
    request: NextRequest,
    {
      params,
    }: { params: { listCategory: (typeof availableLists)[number]; id: string } }
  ) => {
    await connect();
    await authenticate(request);
    await allow(request, [`${params.listCategory}.list`]);

    const document = await List.findOne({
      _id: params.id,
      category: params.listCategory,
    });
    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (
    request: NextRequest,
    {
      params,
    }: { params: { listCategory: (typeof availableLists)[number]; id: string } }
  ) => {
    await connect();
    await authenticate(request);
    await allow(request, [`${params.listCategory}.edit`]);

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
);

export const DELETE = handleErrors(
  async (
    request: NextRequest,
    {
      params,
    }: { params: { listCategory: (typeof availableLists)[number]; id: string } }
  ) => {
    await connect();
    await authenticate(request);
    await allow(request, [`${params.listCategory}.delete`]);

    const deletedDocument = await List.findOneAndDelete({
      _id: params.id,
      category: params.listCategory,
    });
    return NextResponse.json(deletedDocument);
  }
);
