import { NextResponse } from "next/server";
import { connect } from "../../../db";
import recalculateQuantities from "../../../offcuts/recalculateQuantities";
import Exit from "../../Exit";
import { HttpError, handleErrors } from "../../../errorHandler";
import authenticate from "@/app/api/authentication/authenticate";
import allow from "@/app/api/authentication/allow";

export const POST = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["exits.validate"]);

    const document = await Exit.findOneAndUpdate(
      {
        _id: params.id,
      },
      {
        $set: {
          validatedAt: new Date(),
          validatedBy: request.user._id,
        },
      },
      { new: true }
    );

    if (!document) {
      throw new HttpError(404, "Not found");
    }

    await Promise.all(
      document.offcuts.map(async (offcut: any) => {
        await recalculateQuantities(offcut.offcut);
      })
    );

    return NextResponse.json(document);
  }
);
