export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import User from "./User";
import { FilterQuery, SortOrder } from "mongoose";
import { handleErrors } from "../errorHandler";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["users.list"]);

  let filters: FilterQuery<typeof User> = {};
  let sort: { [key: string]: SortOrder } = {
    date: "desc",
  };

  if (request.nextUrl.searchParams.has("role")) {
    filters = { ...filters, role: request.nextUrl.searchParams.get("role") };
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

  const document = await User.find(filters).sort(sort).limit(limit).skip(skip);
  const count = await User.countDocuments(filters);
  return NextResponse.json(document, {
    headers: [["x-total-count", count.toString()]],
  });
});

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["users.edit"]);

  const { firstName, lastName, company, email, role } = await request.json();
  const addedDocument = await User.create({
    firstName,
    lastName,
    company,
    email,
    role,
  });
  // TODO: send registration email
  return NextResponse.json(addedDocument);
});
