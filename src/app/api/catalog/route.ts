export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import getOffcuts from "../offcuts/getOffcuts";
import { HttpError, handleErrors } from "../errorHandler";
import { connect } from "../db";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";
import List from "../[listCategory]/List";
import { FilterQuery } from "mongoose";

export const GET = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["catalog.list"]);

  let filters: FilterQuery<typeof List> = {
    category: "audiences",
  };

  if (!request.user.role.actions.includes("catalog.list-private")) {
    filters = {
      ...filters,
      key: "public",
    };
  }

  const audience = await List.find(filters);

  if (!audience) {
    throw new HttpError(404, "Audience not found");
  }

  const { documents, count } = await getOffcuts(
    request,
    audience.map((a) => a._id.toString())
  );

  return NextResponse.json(documents, {
    headers: [["x-total-count", count.toString()]],
  });
});
