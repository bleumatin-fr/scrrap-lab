import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../db";
import recalculateQuantities from "../../../offcuts/recalculateQuantities";
import Exit from "../../Exit";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  const document = await Exit.findOneAndUpdate(
    {
      _id: params.id,
    },
    {
      $set: {
        validatedAt: new Date(),
        validatedBy: "USER",
      },
    },
    { new: true }
  );

  if (!document) {
    return NextResponse.json(
      { error: "Document not found" },
      {
        status: 404,
      }
    );
  }

  await Promise.all(
    document.offcuts.map(async (offcut: any) => {
      await recalculateQuantities(offcut.offcut);
    })
  );

  return NextResponse.json(document);
}
