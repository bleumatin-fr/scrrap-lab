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
        path: "qualities",
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
  {
    path: "createdBy",
    model: "User",
  },
  {
    path: "validatedBy",
    model: "User",
  }
];

export default populatePaths;
