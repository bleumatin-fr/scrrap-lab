import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Transport from "./Transport";
import { FilterQuery, SortOrder } from "mongoose";

export async function GET(request: NextRequest) {
  await connect();
  let filters: FilterQuery<typeof Transport> = {};
  let sort: { [key: string]: SortOrder } = {
    date: "desc",
  };

  if (request.nextUrl.searchParams.has("mode")) {
    filters = { ...filters, mode: request.nextUrl.searchParams.get("mode") };
  }

  if (request.nextUrl.searchParams.has("_sort")) {
    const sortProperty = request.nextUrl.searchParams.get("_sort") || "date";
    const order = request.nextUrl.searchParams.get("_order") || "ASC";
    sort = {
      [sortProperty]: order === "ASC" ? 1 : -1,
    };
  }

  const document = await Transport.find(filters).sort(sort);
  const count = await Transport.countDocuments(filters);
  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
}

export async function POST(request: NextRequest) {
  await connect();
  const {
    date,
    mode,
    consumption,
    distance,
    weight,
    passengers,
    reason,
    from,
    to,
  } = await request.json();
  const addedDocument = await Transport.create({
    date,
    mode,
    consumption,
    distance,
    weight,
    passengers,
    reason,
    from,
    to,
  });
  return NextResponse.json(addedDocument);
}
