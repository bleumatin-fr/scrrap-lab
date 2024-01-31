import { NextRequest, NextResponse } from "next/server";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";
import { connect } from "../../db";
import { handleErrors } from "../../errorHandler";
import Role from "../Role";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["roles.list"]);

    const document = await Role.findOne({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["roles.edit"]);

    const { name, actions } = await request.json();

    const updatedDocument = await Role.findOneAndUpdate(
      {
        _id: params.id,
      },
      {
        $set: {
          name,
          actions,
        },
      },
      { new: true }
    );

    return NextResponse.json(updatedDocument);
  }
);

export const DELETE = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["roles.delete"]);

    const document = await Role.findOne({
      _id: params.id,
    });

    await Role.findOneAndDelete({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);
