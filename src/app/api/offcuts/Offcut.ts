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
  reference: string;
  description?: string;
  quantity: number;
  matter: ExtractInterface<typeof List>;
  material: ExtractInterface<typeof List>;
  sizes?: ExtractInterface<typeof List>[];
  colors?: ExtractInterface<typeof List>[];
  createdAt: Date;
  updatedAt: Date;
  pictures?: Picture[];
  quality?: ExtractInterface<typeof List>;
  audiences: ExtractInterface<typeof List>[];
  brandPolicy?: ExtractInterface<typeof List>;
  source?: string;
}

export const offcutSchema = new Schema<Offcut>(
  {
    name: { type: String, index: true, required: true },
    reference: { type: String, index: true, required: true },
    description: { type: String, index: true },
    quantity: { type: Number, default: 0, required: true },
    matter: { type: Schema.Types.ObjectId, ref: "List", required: true },
    material: { type: Schema.Types.ObjectId, ref: "List", required: true },
    sizes: [{ type: Schema.Types.ObjectId, ref: "List" }],
    colors: [{ type: Schema.Types.ObjectId, ref: "List" }],
    quality: { type: Schema.Types.ObjectId, ref: "List" },
    audiences: [{ type: Schema.Types.ObjectId, ref: "List", required: true }],
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
