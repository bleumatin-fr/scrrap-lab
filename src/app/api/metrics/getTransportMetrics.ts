import Transport from "../transports/Transport";
import Metric from "./Metric";

const getTransportMetrics = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const data = await Transport.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $lookup: {
        from: "lists",
        localField: "mode",
        foreignField: "_id",
        as: "mode",
      },
    },
    {
      $lookup: {
        from: "lists",
        localField: "reason",
        foreignField: "_id",
        as: "reason",
      },
    },
    {
      $group: {
        _id: {
          mode: "$mode.key",
          reason: "$reason.key",
        },
        key: { $first: "$mode.key" },
        passengerKm: {
          $sum: {
            $multiply: ["$distance", "$passengers"],
          },
        },
        tonKm: {
          $sum: {
            $multiply: [
              "$distance",
              // base unit is in kg
              {
                $divide: ["$weight", 1000],
              },
            ],
          },
        },
      },
    },
  ]);

  return data
    .filter((item: any) => !!item._id.reason[0] && !!item._id.mode[0])
    .reduce((acc: any, item: any) => {
      return [
        ...acc,
        {
          id: `transports-${item._id.reason}-${item._id.mode}-passengerkm`,
          category: "transports",
          value: item.passengerKm,
          unit: "passager.km",
        },
        {
          id: `transports-${item._id.reason}-${item._id.mode}-tonkm`,
          category: "transports",
          value: item.tonKm,
          unit: "tonne.km",
        },
      ];
    }, []);
};

export default getTransportMetrics;
