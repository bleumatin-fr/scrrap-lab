import { NextResponse } from "next/server";
import { connect } from "../../db";
import recalculateQuantities from "../../offcuts/recalculateQuantities";
import Exit from "../Exit";
import populatePaths from "../populatePaths";
import { handleErrors } from "../../errorHandler";
import authenticate from "../../authentication/authenticate";
import allow from "../../authentication/allow";
import { HttpError } from "react-admin";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["exits.list", "exits.list-own"]);

    const document = await Exit.findOne({
      _id: params.id,
    }).populate(populatePaths);

    if (
      !request.user.role.actions.includes("exits.list") &&
      request.user._id.toString() !== document?.createdBy._id?.toString()
    ) {
      throw new HttpError(403, "Forbidden");
    }

    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["exits.edit", "exits.edit-own"]);

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

    const foundDocument = await Exit.findOne({
      _id: params.id,
    });

    if (
      !request.user.role.actions.includes("exits.edit") &&
      request.user._id.toString() !== foundDocument?.createdBy._id?.toString()
    ) {
      throw new HttpError(403, "Forbidden");
    }

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
);

export const DELETE = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["exits.delete", "exits.delete-own"]);

    const document = await Exit.findOne({
      _id: params.id,
    });

    if (
      !request.user.role.actions.includes("exits.delete") &&
      request.user._id.toString() !== document?.createdBy._id?.toString()
    ) {
      throw new HttpError(403, "Forbidden");
    }

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
);
