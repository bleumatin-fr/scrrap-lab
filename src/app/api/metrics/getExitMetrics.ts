import Exit from "../exits/Exit";
import Metric from "./Metric";

const getExitMetrics = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const data = await Exit.aggregate([
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
      id: `exits-${item.key}-weight`,
      category: "exits",
      // base unit is g
      value: item.weight / 1000,
      unit: "kg",
    };
  });
};

export default getExitMetrics;
