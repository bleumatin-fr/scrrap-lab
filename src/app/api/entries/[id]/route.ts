import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import recalculateQuantities from "../../offcuts/recalculateQuantities";
import Transport from "../../transports/Transport";
import Entry from "../Entry";
import populatePaths from "../populatePaths";
import { handleErrors } from "../../errorHandler";
import authenticate from "../../authentication/authenticate";
import allow from "../../authentication/allow";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["entries.list"]);

    const document = await Entry.findOne({
      _id: params.id,
    }).populate(populatePaths);

    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["entries.edit"]);

    const { date, transports, offcuts } = await request.json();

    const transportIds = await Promise.all(
      transports.map(async (transport: any) => {
        if (!transport.new) {
          return transport.id;
        }
        const createdTransport = await Transport.create(transport);
        return createdTransport._id;
      })
    );

    const offcutIds = offcuts.map((offcut: any) => {
      if (offcut.id) {
        return {
          _id: offcut.id,
          offcut: offcut.offcut.id,
          quantity: offcut.quantity,
        };
      }
      return {
        offcut: offcut.offcut.id,
        quantity: offcut.quantity,
      };
    });

    const updatedDocument = await Entry.findOneAndUpdate(
      {
        _id: params.id,
      },
      {
        $set: {
          date,
          transports: transportIds,
          offcuts: offcutIds,
        },
      },
      { new: true }
    );

    await Promise.all(
      offcuts.map(async (offcut: any) => {
        await recalculateQuantities(offcut.offcut.id);
      })
    );

    return NextResponse.json(updatedDocument);
  }
);

export const DELETE = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["entries.delete"]);

    const document = await Entry.findOne({
      _id: params.id,
    });

    await Entry.findOneAndDelete({
      _id: params.id,
    });

    if (document) {
      await Promise.all(
        document.offcuts.map(async (offcut: any) => {
          await recalculateQuantities(offcut.offcut);
        })
      );
    }

    return NextResponse.json(document);
  }
);
