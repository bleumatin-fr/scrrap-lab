import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import List, { availableLists } from "./List";
import { handleErrors } from "../errorHandler";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";

export const GET = handleErrors(
  async (
    request: NextRequest,
    { params }: { params: { listCategory: (typeof availableLists)[number] } }
  ) => {
    await connect();
    await authenticate(request);
    await allow(request, [`${params.listCategory}.list`]);
    
    let filters: FilterQuery<typeof List> = {
      category: params.listCategory,
    };

    if (request.nextUrl.searchParams.has("id")) {
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
);

export const POST = handleErrors(
  async (
    request: NextRequest,
    { params }: { params: { listCategory: (typeof availableLists)[number] } }
  ) => {
    await connect();
    await authenticate(request);
    await allow(request, [`${params.listCategory}.edit`]);

    const { key, value, parent } = await request.json();
    const createdDocument = await List.create({
      category: params.listCategory,
      key,
      value,
      parent,
    });
    return NextResponse.json(createdDocument);
  }
);
