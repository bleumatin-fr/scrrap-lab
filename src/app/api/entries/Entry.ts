import mongoose, { Model, Schema, model } from "mongoose";
import normalize from "normalize-mongoose";
import Offcut from "../offcuts/Offcut";
import Transport from "../transports/Transport";
import { User } from "../users/User";
interface OffCutQuantity {
  offcut: typeof Offcut;
  quantity: number;
}

const OffCutQuantitySchema = new Schema<OffCutQuantity>({
  offcut: {
    type: Schema.Types.ObjectId,
    ref: "Offcut",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

OffCutQuantitySchema.plugin(normalize);

interface Entry {
  date: Date;
  transports: (typeof Transport)[];
  offcuts: OffCutQuantity[];
  createdBy: User;
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

entrySchema.plugin(normalize);

export default (mongoose.models?.Entry as Model<Entry>) ||
  model<Entry>("Entry", entrySchema);
