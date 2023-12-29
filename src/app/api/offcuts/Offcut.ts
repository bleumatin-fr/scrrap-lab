import mongoose, { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";
import List from "../[listCategory]/List";
import { ExtractInterface } from "../db";

export interface Picture {
  _id?: string;
  title: string;
  src: string;
}

interface Offcut {
  name: string;
  description: string;
  quantity: number;
  matter: ExtractInterface<typeof List>;
  material: ExtractInterface<typeof List>;
  sizes: ExtractInterface<typeof List>[];
  colors: ExtractInterface<typeof List>[];
  createdAt: Date;
  updatedAt: Date;
  pictures: Picture[];
  quality: ExtractInterface<typeof List>;
  reference: string;
  audience: ExtractInterface<typeof List>;
  brandPolicy: ExtractInterface<typeof List>;
  source: string;
}

export const offcutSchema = new Schema<Offcut>(
  {
    name: { type: String, index: true },
    reference: { type: String, index: true },
    description: { type: String, index: true },
    quantity: { type: Number },
    matter: { type: Schema.Types.ObjectId, ref: "List" },
    material: { type: Schema.Types.ObjectId, ref: "List" },
    sizes: [{ type: Schema.Types.ObjectId, ref: "List" }],
    colors: [{ type: Schema.Types.ObjectId, ref: "List" }],
    quality: { type: Schema.Types.ObjectId, ref: "List" },
    audience: { type: Schema.Types.ObjectId, ref: "List" },
    brandPolicy: { type: Schema.Types.ObjectId, ref: "List" },
    source: { type: String },
    pictures: [
      {
        title: { type: String },
        src: { type: String },
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

offcutSchema.plugin(normalize);
offcutSchema.index({
  name: "text",
  reference: "text",
  description: "text",
});

type OffcutType = mongoose.Model<
  Offcut,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, Offcut> &
    Offcut &
    Required<{
      _id: Schema.Types.ObjectId;
    }>,
  any
>;

export default (mongoose.models.Offcut as unknown as OffcutType) ||
  mongoose.model<Offcut>("Offcut", offcutSchema);