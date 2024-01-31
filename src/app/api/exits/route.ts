import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Exit from "./Exit";
import { FilterQuery, SortOrder } from "mongoose";
import populatePaths from "./populatePaths";
import recalculateQuantities from "../offcuts/recalculateQuantities";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";
import { handleErrors } from "../errorHandler";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["exits.list"]);

  let filters: FilterQuery<typeof Exit> = {};
  let sort: { [key: string]: SortOrder } = {
    date: "desc",
  };

  if (request.nextUrl.searchParams.has("validated")) {
    filters = {
      ...filters,
      validatedAt: { $exists: true },
    };
  }

  if (request.nextUrl.searchParams.has("to-validate")) {
    filters = {
      ...filters,
      validatedAt: { $exists: false },
    };
  }

  if (request.nextUrl.searchParams.has("_sort")) {
    const sortProperty = request.nextUrl.searchParams.get("_sort") || "date";
    const order = request.nextUrl.searchParams.get("_order") || "ASC";
    sort = {
      [sortProperty]: order === "ASC" ? 1 : -1,
    };
  }

  const document = await Exit.find(filters).sort(sort).populate(populatePaths);
  const count = await Exit.countDocuments(filters);
  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
});

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["exits.create"]);

  const { date, offcuts } = await request.json();

  const offcutIds = offcuts.map((offcut: any) => {
    return {
      offcut: offcut.offcut.id,
      quantity: offcut.quantity,
    };
  });

  const addedDocument = await Exit.create({
    date,
    offcuts: offcutIds,
  });

  await Promise.all(
    offcuts.map(async (offcut: any) => {
      await recalculateQuantities(offcut.offcut.id);
    })
  );

  return NextResponse.json(addedDocument);
});
