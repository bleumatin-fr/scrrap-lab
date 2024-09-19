import { NextRequest, NextResponse } from "next/server";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";
import { connect } from "../../db";
import { handleErrors } from "../../errorHandler";
import Mail from "../Mail";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["mails.list"]);

    const document = await Mail.findOne({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["mails.edit"]);

    const { key, subject, html, text } = await request.json();

    const updatedDocument = await Mail.findOneAndUpdate(
      {
        _id: params.id,
      },
      {
        $set: {
          key,
          subject,
          html,
          text,
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
    await allow(request, ["mails.delete"]);

    const document = await Mail.findOne({
      _id: params.id,
    });

    await Mail.findOneAndDelete({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);
