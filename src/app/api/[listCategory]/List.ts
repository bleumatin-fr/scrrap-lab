import mongoose, { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

export const availableLists = [
  // "offcuts",
  "matters",
  "materials",
  "sizes",
  "colors",
  "qualities",
  "audiences",
  "brandPolicies",
  // "transports",
  "transportModes",
  "transportReasons",
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

type ListType = mongoose.Model<
  List,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, List> &
    List &
    Required<{
      _id: Schema.Types.ObjectId;
    }>,
  any
>;

export default (mongoose.models.List as unknown as ListType) ||
  mongoose.model<List>("List", listSchema);
