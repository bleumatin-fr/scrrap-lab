const populatePaths = [
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
        path: "audience",
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