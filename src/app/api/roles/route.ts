export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Role from "./Role";
import { FilterQuery, SortOrder } from "mongoose";
import { handleErrors } from "../errorHandler";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["roles.list"]);

  let filters: FilterQuery<typeof Role> = {};
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

  let limit = 0;
  let skip = 0;
  if (request.nextUrl.searchParams.has("_start")) {
    skip = parseInt(request.nextUrl.searchParams.get("_start") || "0");
  }
  if (request.nextUrl.searchParams.has("_end")) {
    limit = parseInt(request.nextUrl.searchParams.get("_end") || "10") - skip;
  }

  const document = await Role.find(filters).sort(sort).limit(limit).skip(skip);
  const count = await Role.countDocuments(filters);

  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
});

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["roles.edit"]);

  const { name, actions } = await request.json();
  const addedDocument = await Role.create({
    name,
    actions,
  });

  return NextResponse.json(addedDocument);
});
