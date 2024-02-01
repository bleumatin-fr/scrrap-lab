import { NextRequest, NextResponse } from "next/server";
import allow from "../authentication/allow";
import authenticate from "../authentication/authenticate";
import { connect } from "../db";
import { handleErrors } from "../errorHandler";
import Offcut from "./Offcut";
import formDataToObject from "./formDataToObject";
import getOffcuts from "./getOffcuts";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["offcuts.list"]);

  const { documents, count } = await getOffcuts(request);

  return NextResponse.json(documents, {
    headers: [["x-total-count", count.toString()]],
  });
});

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["offcuts.create"]);

  const formData = await request.formData();
  let modifications = await formDataToObject(formData);
  const createdDocument = await Offcut.create(modifications);
  return NextResponse.json(createdDocument);
});
