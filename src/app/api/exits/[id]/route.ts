import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import recalculateQuantities from "../../offcuts/recalculateQuantities";
import Exit from "../Exit";
import populatePaths from "../populatePaths";

export async function GET(
  request: NextRequest,
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  const document = await Exit.findOne({
    _id: params.id,
  });

  await Exit.findOneAndDelete({
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
