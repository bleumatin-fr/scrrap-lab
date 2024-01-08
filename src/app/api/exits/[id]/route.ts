import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import Exit from "../Exit";
import { NextApiRequest } from "next";
import Transport from "../../transports/Transport";
import populatePaths from "../populatePaths";
import recalculateQuantities from "../../offcuts/recalculateQuantities";

export async function GET(
  request: NextApiRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const document = await Exit.findOne({
    _id: params.id,
  }).populate(populatePaths);

  return NextResponse.json(document);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const { date, offcuts } = await request.json();

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

  const updatedDocument = await Exit.findOneAndUpdate(
    {
      _id: params.id,
    },
    {
      $set: {
        date,
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
  const deletedDocument = await Exit.findOneAndDelete({
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
