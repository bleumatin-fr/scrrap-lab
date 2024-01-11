import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import List, { availableLists } from "./List";

export async function GET(
  request: NextRequest,
  { params }: { params: { listCategory: (typeof availableLists)[number] } }
) {
  await connect();
  let filters: FilterQuery<typeof List> = {
    category: params.listCategory,
  };

  if (request.nextUrl.searchParams.has("id")) {
    const id = request.nextUrl.searchParams.get("id");
    const ids = request.nextUrl.searchParams.getAll("id");
    filters = { ...filters, _id: ids };
  }

  if (request.nextUrl.searchParams.has("parent")) {
    const parent = request.nextUrl.searchParams.get("parent");
    if (parent === "none") {
      filters = { ...filters, parent: null };
    } else {
      filters = { ...filters, parent };
    }
  }

  const documents = await List.find(filters);
  const count = await List.countDocuments(filters);
  return NextResponse.json(documents, {
    headers: [["x-total-count", count.toString()]],
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { listCategory: (typeof availableLists)[number] } }
) {
  await connect();
  const { key, value, parent } = await request.json();
  const createdDocument = await List.create({
    category: params.listCategory,
    key,
    value,
    parent,
  });
  return NextResponse.json(createdDocument);
}
