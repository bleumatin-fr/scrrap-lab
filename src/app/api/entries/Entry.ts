import mongoose, { Schema } from "mongoose";
import normalize from "normalize-mongoose";
import { ExtractInterface } from "../db";
import List from "../[listCategory]/List";
import Transport from "../transports/Transport";
import Offcut from "../offcuts/Offcut";

interface Entry {
  date: Date;
  transports: (typeof Transport)[];
  offcuts: {
    offcut: typeof Offcut;
    quantity: number;
  }[];
}

export const entrySchema = new Schema<Entry>(
  {},
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

entrySchema.plugin(normalize);

type EntryType = mongoose.Model<
  Entry,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, Entry> &
    Entry &
    Required<{
      _id: Schema.Types.ObjectId;
    }>,
  any
>;

export default (mongoose.models.Entry as unknown as EntryType) ||
  mongoose.model<Entry>("Entry", entrySchema);
