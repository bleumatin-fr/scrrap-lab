import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Investment from "./Investment";
import { FilterQuery, SortOrder } from "mongoose";
import { handleErrors } from "../errorHandler";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["investments.list"]);

  let filters: FilterQuery<typeof Investment> = {};
  let sort: { [key: string]: SortOrder } = {
    createdAt: "desc",
  };

  if (request.nextUrl.searchParams.has("type")) {
    filters = { ...filters, type: request.nextUrl.searchParams.get("type") };
  }

  if (request.nextUrl.searchParams.has("_sort")) {
    const sortProperty = request.nextUrl.searchParams.get("_sort") || "date";
    const order = request.nextUrl.searchParams.get("_order") || "ASC";
    sort = {
      [sortProperty]: order === "ASC" ? 1 : -1,
    };
  }

  let limit = 10;
  let skip = 0;
  if (request.nextUrl.searchParams.has("_start")) {
    skip = parseInt(request.nextUrl.searchParams.get("_start") || "0");
  }
  if (request.nextUrl.searchParams.has("_end")) {
    limit = parseInt(request.nextUrl.searchParams.get("_end") || "10") - skip;
  }

  const document = await Investment.find(filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);
  const count = await Investment.countDocuments(filters);
  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
});

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["investments.create"]);

  const {
    type,
    condition,
    reference,
    name,
    weight,
    usagePeriod,
    usageStart,
    quantity,
    meta,
  } = await request.json();
  const addedDocument = await Investment.create({
    type,
    condition,
    reference,
    name,
    weight,
    usagePeriod,
    usageStart,
    quantity,
    meta,
  });
  return NextResponse.json(addedDocument);
});
