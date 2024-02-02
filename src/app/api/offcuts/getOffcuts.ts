import { FilterQuery, SortOrder } from "mongoose";
import { NextRequest } from "next/server";
import Offcut from "./Offcut";

const getOffcuts = async (request: NextRequest, audience? : string[]) => {
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
    if (request.nextUrl.searchParams.has("_start")) {
      skip = parseInt(request.nextUrl.searchParams.get("_start") || "0");
    }
    if (request.nextUrl.searchParams.has("_end")) {
      limit = parseInt(request.nextUrl.searchParams.get("_end") || "10") - skip;
    }
  
    const documents = await Offcut.find(filters)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate(populate);
  
    const count = await Offcut.countDocuments(filters);
  
    return { documents, count };
  }
  
  
  export default getOffcuts;