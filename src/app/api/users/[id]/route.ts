import { NextRequest, NextResponse } from "next/server";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";
import { connect } from "../../db";
import { handleErrors } from "../../errorHandler";
import User from "../User";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["users.list"]);

    const document = await User.findOne({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["users.edit"]);

    const { firstName, lastName, company, email, role } = await request.json();

    const updatedDocument = await User.findOneAndUpdate(
      {
        _id: params.id,
      },
      {
        $set: {
          firstName,
          lastName,
          company,
          email,
          role,
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
    await allow(request, ["users.delete"]);

    const document = await User.findOne({
      _id: params.id,
    });

    await User.findOneAndDelete({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);
