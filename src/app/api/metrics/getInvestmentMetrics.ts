import List from "../[listCategory]/List";
import Metric from "./Metric";

const getInvestmentMetrics = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const data = await List.aggregate([
    {
      $match: {
        category: "investmentTypes",
      },
    },
    {
      $lookup: {
        from: "investments",
        localField: "_id",
        foreignField: "type",
        as: "investments",
      },
    },
    {
      $unwind: "$investments",
    },
    {
      $match: {
        "investments.usageStart": {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        key: { $first: "$key" },
        weight: { $sum: "$investments.weight" },
        quantity: { $sum: "$investments.quantity" },
      },
    },
  ]);

  return [
    ...data.map((item: any) => {
      return {
        id: `investments-${item.key}-weight`,
        category: "investments",
        value: item.weight,
      };
    }),
    ...data.map((item: any) => {
      return {
        id: `investments-${item.key}-quantity`,
        category: "investments",
        value: item.quantity,
      };
    }),
  ];
};

export default getInvestmentMetrics;
