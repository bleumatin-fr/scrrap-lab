import mongoose, { Schema } from "mongoose";
import normalize from "normalize-mongoose";
import Offcut from "../offcuts/Offcut";
import Transport from "../transports/Transport";


interface OffCutQuantity {
  offcut: typeof Offcut;
  quantity: number;
}

const OffCutQuantitySchema = new Schema<OffCutQuantity>(
  {
    offcut: {
      type: Schema.Types.ObjectId,
      ref: "Offcut",
    },
    quantity: {
      type: Number,
      required: true,
    },
  }
);

OffCutQuantitySchema.plugin(normalize);

interface Entry {
  date: Date;
  transports: (typeof Transport)[];
  offcuts: OffCutQuantity[];
}

export const entrySchema = new Schema<Entry>(
  {
    date: {
      type: Date,
      required: true,
    },
    transports: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transport",
      },
    ],
    offcuts: [OffCutQuantitySchema],
  },
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
