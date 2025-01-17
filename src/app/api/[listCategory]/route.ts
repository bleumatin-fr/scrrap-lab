import { FilterQuery, SortOrder } from "mongoose";
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
      if (parent !== "none") {
        filters = { ...filters, parent };
      }
    }

    let sort: { [key: string]: SortOrder } = {
      order: "asc",
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

    const documents = await List.find(filters)
      .sort(sort)
      .limit(limit)
      .skip(skip);
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

    const maxOrder = await List.findOne(
      { category: params.listCategory },
      {},
      { sort: { order: -1 } }
    );

    const { key, value, parent } = await request.json();
    const createdDocument = await List.create({
      category: params.listCategory,
      key,
      value,
      parent,
      order: maxOrder && maxOrder.order ? maxOrder.order + 1 : 0,
    });
    return NextResponse.json(createdDocument);
  }
);
