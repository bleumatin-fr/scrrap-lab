import { NextRequest, NextResponse } from "next/server";
import { connect } from "../db";
import Offcut from "./Offcut";
import formDataToObject from "./formDataToObject";
import { FilterQuery, SortOrder } from "mongoose";
import { handleErrors } from "../errorHandler";
import authenticate from "../authentication/authenticate";
import allow from "../authentication/allow";

export const getOffcuts = async (request: NextRequest, audience? : string[]) => {
  let filters: FilterQuery<typeof Offcut> = {};
  let sort: { [key: string]: SortOrder } = {
    createdAt: "desc",
  };

  if (request.nextUrl.searchParams.has("q")) {
    const q = request.nextUrl.searchParams.get("q");
    if (q) {
      filters = {
        ...filters,
        $or: [
          { name: new RegExp(q, "i") },
          { reference: new RegExp(q, "i") },
          { description: new RegExp(q, "i") },
          { $text: { $search: q } },
        ],
      };
    }
  }

  if (request.nextUrl.searchParams.has("id")) {
    const ids = request.nextUrl.searchParams.getAll("id");
    filters = { ...filters, _id: { $in: ids } };
  }

  if (request.nextUrl.searchParams.has("matter")) {
    const matter = request.nextUrl.searchParams.get("matter");
    filters = { ...filters, matter };
  }

  if (request.nextUrl.searchParams.has("material")) {
    const material = request.nextUrl.searchParams.get("material");
    filters = { ...filters, material };
  }

  if (request.nextUrl.searchParams.has("sizes")) {
    const sizes = request.nextUrl.searchParams.getAll("sizes");
    filters = {
      ...filters,
      sizes: {
        $in: sizes,
      },
    };
  }

  if (request.nextUrl.searchParams.has("colors")) {
    const colors = request.nextUrl.searchParams.getAll("colors");
    filters = {
      ...filters,
      colors: {
        $in: colors,
      },
    };
  }

  if (request.nextUrl.searchParams.has("quality")) {
    const quality = request.nextUrl.searchParams.get("quality");
    filters = { ...filters, quality };
  }

  if (request.nextUrl.searchParams.has("audiences")) {
    const audiences = request.nextUrl.searchParams.get("audiences");
    filters = {
      ...filters,
      audiences: {
        $in: audiences,
      },
    };
  }

  if (request.nextUrl.searchParams.has("createdBefore")) {
    const createdBefore = request.nextUrl.searchParams.get("createdBefore");
    filters = {
      ...filters,
      createdAt: {
        $lte: createdBefore,
      },
    };
  }

  if (request.nextUrl.searchParams.has("createdAfter")) {
    const createdAfter = request.nextUrl.searchParams.get("createdAfter");
    filters = {
      ...filters,
      createdAt: {
        ...filters.createdAt,
        $gte: createdAfter,
      },
    };
  }

  if (request.nextUrl.searchParams.has("_sort")) {
    const sortProperty = request.nextUrl.searchParams.get("_sort") || "date";
    const order = request.nextUrl.searchParams.get("_order") || "ASC";
    sort = {
      [sortProperty]: order === "ASC" ? 1 : -1,
    };
  }

  if(audience) {
    filters = {
      ...filters,
      audiences: {
        $in: audience,
      },
    };
  }

  let populate: string[] = [];
  if (request.nextUrl.searchParams.has("meta.populate")) {
    populate = request.nextUrl.searchParams.getAll("meta.populate");
  }

  let limit = 10;
  let skip = 0;
  if (request.nextUrl.searchParams.has("_limit")) {
    limit = parseInt(request.nextUrl.searchParams.get("_limit") || "10");
  }
  if (request.nextUrl.searchParams.has("_skip")) {
    skip = parseInt(request.nextUrl.searchParams.get("_skip") || "0");
  }

  const documents = await Offcut.find(filters)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate(populate);

  const count = await Offcut.countDocuments(filters);

  return { documents, count };
}


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
