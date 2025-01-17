import { NextResponse } from "next/server";
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
  await allow(request, ["exits.list", "exits.list-own"]);

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

  if (
    !request.user.role.actions.includes("exits.list") &&
    request.user.role.actions.includes("exits.list-own")
  ) {
    filters = {
      ...filters,
      createdBy: request.user._id,
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
      date: "desc",
    };
  }

  let limit = 0;
  let skip = 0;
  if (request.nextUrl.searchParams.has("_start")) {
    skip = parseInt(request.nextUrl.searchParams.get("_start") || "0");
  }
  if (request.nextUrl.searchParams.has("_end")) {
    limit = parseInt(request.nextUrl.searchParams.get("_end") || "10") - skip;
  }

  const document = await Exit.find(filters)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate(populatePaths);

  const count = await Exit.countDocuments(filters);
  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
});

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["exits.create", "catalog.cart"]);

  let validated = {};
  if (request.user.role.actions.includes("exits.validate")) {
    validated = {
      validatedAt: new Date(),
      validatedBy: request.user._id,
    };
  }

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
    createdBy: request.user._id,
    ...validated,
  });

  await Promise.all(
    offcuts.map(async (offcut: any) => {
      await recalculateQuantities(offcut.offcut.id);
    })
  );

  return NextResponse.json(addedDocument);
});
