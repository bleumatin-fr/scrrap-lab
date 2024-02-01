import Investment from "../investments/Investment";
import Metric from "./Metric";

const getInvestmentMetrics = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const data = await Investment.aggregate([
    {
      $lookup: {
        from: "lists",
        localField: "condition",
        foreignField: "_id",
        as: "condition",
      },
    },
    {
      $lookup: {
        from: "lists",
        localField: "type",
        foreignField: "_id",
        as: "type",
      },
    },
    {
      $addFields: {
        usageEnd: {
          $dateAdd: {
            startDate: "$usageStart",
            unit: "year",
            amount: "$usagePeriod",
          },
        },
      },
    },
    {
      $group: {
        _id: {
          condition: "$condition.key",
          type: "$type.key",
        },
        investments: {
          $addToSet: {
            start: "$usageStart",
            end: "$usageEnd",
            quantity: "$quantity",
            weight: "$weight",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        investments: {
          $filter: {
            input: "$investments",
            as: "investment",
            cond: {
              $and: [
                { $lte: ["$$investment.start", end] },
                { $gte: ["$$investment.end", start] },
              ],
            },
          },
        },
      },
    },
  ]);
  
  return data
    .filter((item: any) => !!item._id.condition[0] && !!item._id.type[0])
    .reduce((acc: any, item: any) => {
      const totalWeight = item.investments.reduce(
        (acc: number, investment: any) => {
          const days =
            (Math.min(investment.end.getTime(), end.getTime()) -
              Math.max(investment.start.getTime(), start.getTime())) /
            (86400 * 1000);
          const factor = days / 365.242374; //nb days in a year
          return acc + investment.weight * investment.quantity * factor;
        },
        0
      );
      const totalQuantity = item.investments.reduce(
        (acc: number, investment: any) => {
          const days =
            (Math.min(investment.end.getTime(), end.getTime()) -
              Math.max(investment.start.getTime(), start.getTime())) /
            (86400 * 1000); //nb ms in a day
          const factor = days / 365.242374; //nb days in a year
          return acc + investment.quantity * factor;
        },
        0
      );

      return [
        ...acc,
        {
          id: `investments-${item._id.condition}-${item._id.type}-weight`,
          category: "investments",
          value: totalWeight,
        },
        {
          id: `investments-${item._id.condition}-${item._id.type}-quantity`,
          category: "investments",
          value: totalQuantity,
        },
      ];
    }, []);
};

export default getInvestmentMetrics;
