import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Offcut from "../Offcut";
import formDataToObject from "../formDataToObject";
import { handleErrors } from "../../errorHandler";
import authenticate from "../../authentication/authenticate";
import allow from "../../authentication/allow";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["offcuts.list"]);

    const document = await Offcut.findOne({
      _id: params.id,
    });
    return NextResponse.json(document);
  }
);

export const POST = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["offcuts.edit"]);

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
);

export const DELETE = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["offcuts.delete"]);

    const deletedDocument = await Offcut.findOneAndDelete({
      _id: params.id,
    });

    return NextResponse.json(deletedDocument);
  }
);
