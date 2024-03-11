import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Transport from "../Transport";
import { handleErrors } from "../../errorHandler";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["transports.list"]);

    const document = await Transport.findOne({
      _id: params.id,
    });
    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["transports.edit"]);

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
);

export const DELETE = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["transports.delete"]);

    const deletedDocument = await Transport.findOneAndDelete({
      _id: params.id,
    });

    return NextResponse.json(deletedDocument);
  }
);
