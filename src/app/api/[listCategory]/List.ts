import mongoose, { Model, model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

export const availableLists = [
  // offcuts
  "matters",
  "materials",
  "sizes",
  "colors",
  "qualities",
  "audiences",
  "brandPolicies",
  // transports
  "transportModes",
  "transportReasons",
  // investments
  "investmentTypes",
  "investmentConditions",
];

interface List {
  category: (typeof availableLists)[number];
  key: string;
  value: string;
  parent?: List;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const listSchema = new Schema<List>(
  {
    category: {
      type: String,
      enum: availableLists,
      required: true,
    },
    parent: { type: Schema.Types.ObjectId, ref: "List" },
    key: { type: String },
    value: { type: String },
    tags: [{ type: String }],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

listSchema.plugin(normalize);

export default (mongoose.models?.List as Model<List>) ||
  model<List>("List", listSchema);
