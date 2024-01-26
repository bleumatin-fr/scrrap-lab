import Entry from "../entries/Entry";
import Metric from "./Metric";

const getEntryMetrics = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const data = await Entry.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $unwind: "$offcuts",
    },
    {
      $lookup: {
        from: "offcuts",
        localField: "offcuts.offcut",
        foreignField: "_id",
        as: "offcuts2",
      },
    },
    {
      $lookup: {
        from: "lists",
        localField: "offcuts2.material",
        foreignField: "_id",
        as: "material",
      },
    },
    {
      $group: {
        _id: "$material._id",
        key: { $first: "$material.key" },
        weight: { $sum: "$offcuts.quantity" },
      },
    },
  ]);

  return data.map((item: any) => {
    return {
      id: ` entries-${item.key}-weight`,
      category: "entries",
      value: item.weight,
    };
  });
};

export default getEntryMetrics;
