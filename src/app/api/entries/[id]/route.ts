import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Entry from "../Entry";
import { NextApiRequest } from "next";
import Transport from "../../transports/Transport";
import populatePaths from "../populatePaths";
import recalculateQuantities from "../../offcuts/recalculateQuantities";

export async function GET(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const document = await Entry.findOne({
    _id: params.id,
  }).populate(populatePaths);

  return NextResponse.json(document);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
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

export async function DELETE(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const deletedDocument = await Entry.findOneAndDelete({
    _id: params.id,
  });

  if (deletedDocument.value) {
    await Promise.all(
      deletedDocument.value.offcuts.map(async (offcut: any) => {
        await recalculateQuantities(offcut.offcut);
      })
    );
  }

  return NextResponse.json(deletedDocument);
}
