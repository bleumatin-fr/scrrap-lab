import List from "../[listCategory]/List";
import Metric from "./Metric";

const getTransportMetricsByReason = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const data = await List.aggregate([
    {
      $match: {
        category: "transportReasons",
      },
    },
    {
      $lookup: {
        from: "transports",
        localField: "_id",
        foreignField: "reason",
        as: "transports",
      },
    },
    {
      $unwind: "$transports",
    },
    {
      $match: {
        "transports.date": {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $addFields: {
        passengerKm: {
          $multiply: ["$transports.distance", "$transports.passengers"],
        },
        tonKm: {
          $multiply: ["$transports.distance", "$transports.weight"],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        key: { $first: "$key" },
        passengerKm: { $sum: "$passengerKm" },
        tonKm: { $sum: "$tonKm" },
      },
    },
  ]);

  return [
    ...data.map((item: any) => {
      return {
        id: `transports-reason-${item.key}-passengerkm`,
        category: "transports",
        value: item.passengerKm,
      };
    }),
    ...data.map((item: any) => {
      return {
        id: `transports-reason-${item.key}-tonkm`,
        category: "transports",
        value: item.tonKm,
      };
    }),
  ];
}

const getTransportMetricsByMode = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const data = await List.aggregate([
    {
      $match: {
        category: "transportModes",
      },
    },
    {
      $lookup: {
        from: "transports",
        localField: "_id",
        foreignField: "mode",
        as: "transports",
      },
    },
    {
      $unwind: "$transports",
    },
    {
      $match: {
        "transports.date": {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $addFields: {
        passengerKm: {
          $multiply: ["$transports.distance", "$transports.passengers"],
        },
        tonKm: {
          $multiply: ["$transports.distance", "$transports.weight"],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        key: { $first: "$key" },
        passengerKm: { $sum: "$passengerKm" },
        tonKm: { $sum: "$tonKm" },
      },
    },
  ]);

  return [
    ...data.map((item: any) => {
      return {
        id: `transports-mode-${item.key}-passengerkm`,
        category: "transports",
        value: item.passengerKm,
      };
    }),
    ...data.map((item: any) => {
      return {
        id: `transports-mode-${item.key}-tonkm`,
        category: "transports",
        value: item.tonKm,
      };
    }),
  ];
}


const getTransportMetrics = async (
  start: Date,
  end: Date
): Promise<Metric[]> => {
  const transportMetricsByReason = await getTransportMetricsByReason(start, end);
  const transportMetricsByMode = await getTransportMetricsByMode(start, end);

  return [
    ...transportMetricsByReason,
    ...transportMetricsByMode,
  ];
};

export default getTransportMetrics;
