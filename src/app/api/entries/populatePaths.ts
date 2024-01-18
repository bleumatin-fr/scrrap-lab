const populatePaths = [
  {
    path: "transports",
    model: "Transport",
    populate: [
      {
        path: "mode",
        model: "List",
      },
      {
        path: "reason",
        model: "List",
      },
    ],
  },
  {
    path: "offcuts.offcut",
    model: "Offcut",
    populate: [
      {
        path: "material",
        model: "List",
      },
      {
        path: "matter",
        model: "List",
      },
      {
        path: "sizes",
        model: "List",
      },
      {
        path: "colors",
        model: "List",
      },
      {
        path: "quality",
        model: "List",
      },
      {
        path: "audiences",
        model: "List",
      },
      {
        path: "brandPolicy",
        model: "List",
      },
    ],
  },
];

export default populatePaths;
