import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Investment from "./Investment";
import { FilterQuery, SortOrder } from "mongoose";

export async function GET(request: NextRequest) {
  await connect();
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

  const document = await Investment.find(filters).sort(sort);
  const count = await Investment.countDocuments(filters);
  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
}

export async function POST(request: NextRequest) {
  await connect();
  const {
    type,
    condition,
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
    name,
    weight,
    usagePeriod,
    usageStart,
    quantity,
    meta,
  });
  return NextResponse.json(addedDocument);
}
