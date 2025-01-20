import { FilterQuery, SortOrder } from "mongoose";
import { NextResponse } from "next/server";
import allow from "../authentication/allow";
import authenticate from "../authentication/authenticate";
import { connect } from "../db";
import { handleErrors } from "../errorHandler";
import Offcut from "../offcuts/Offcut";
import recalculateQuantities from "../offcuts/recalculateQuantities";
import Transport from "../transports/Transport";
import User from "../users/User";
import Entry from "./Entry";
import populatePaths from "./populatePaths";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["entries.list"]);

  const offcutReference = request.nextUrl.searchParams.get("offcuts.reference");
  const userId = request.nextUrl.searchParams.get("createdBy.id");

  let filters: FilterQuery<typeof Entry> = {};
  if (offcutReference) {
    const filteredOffcut = await Offcut.findOne({
      reference: offcutReference,
    }).exec();

    if (filteredOffcut) {
      filters.offcuts = {
        $elemMatch: {
          offcut: filteredOffcut._id,
        },
      };
    }
  }

  if (userId) {
    const user = await User.findOne({
      _id: userId,
    }).exec();

    filters.createdBy = {
      $eq: user?._id,
    };
  }

  let sort: { [key: string]: SortOrder } = {
    date: "desc",
  };

  if (request.nextUrl.searchParams.has("_sort")) {
    const sortProperty = request.nextUrl.searchParams.get("_sort") || "date";
    const order = request.nextUrl.searchParams.get("_order") || "ASC";
    sort = {
      [sortProperty]: order === "ASC" ? 1 : -1,
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

  const document = await Entry.find(filters)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate(populatePaths);
  const count = await Entry.countDocuments(filters);
  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
});

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["entries.edit"]);

  const { date, transports, offcuts } = await request.json();

  const transportIds = await Promise.all(
    transports.map(async (transport: any) => {
      const createdTransport = await Transport.create(transport);
      return createdTransport._id;
    })
  );

  const offcutIds = offcuts.map((offcut: any) => {
    return {
      offcut: offcut.offcut.id,
      quantity: offcut.quantity,
    };
  });

  const addedDocument = await Entry.create({
    date,
    transports: transportIds,
    offcuts: offcutIds,
    createdBy: request.user._id,
  });

  await Promise.all(
    offcuts.map(async (offcut: any) => {
      await recalculateQuantities(offcut.offcut.id);
    })
  );

  return NextResponse.json(addedDocument);
});
