export const dynamic = "force-dynamic";

import jwt from "jsonwebtoken";
import { FilterQuery, SortOrder } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import allow from "../authentication/allow";
import authenticate from "../authentication/authenticate";
import { connect } from "../db";
import { handleErrors } from "../errorHandler";
import { mail, send } from "../mail";
import User from "./User";

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

  const payload = {
    id: addedDocument._id,
  };
  if (!process.env.RESET_PASSWORD_TOKEN_SECRET) {
    throw new Error("Environment variable RESET_PASSWORD_TOKEN_SECRET not set");
  }
  if (!process.env.JWT_EXPIRY) {
    throw new Error("Environment variable JWT_EXPIRY not set");
  }
  if (!process.env.BASE_URL) {
    throw new Error("Environment variable BASE_URL not set");
  }
  if (!process.env.MAIL_FROM) {
    throw new Error("Environment variable MAIL_FROM not set");
  }

  const token = jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, {
    expiresIn: Number(process.env.JWT_EXPIRY),
  });

  addedDocument.resetPasswordToken = token;
  await addedDocument.save();

  await send({
    to: email,
    from: process.env.MAIL_FROM,
    ...(await mail("account-created", {
      user: addedDocument,
      link: `${process.env.BASE_URL}/activate/${token}`,
    })),
  });

  return NextResponse.json(addedDocument);
});
