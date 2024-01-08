import mongoose, { Schema } from "mongoose";
import normalize from "normalize-mongoose";
import Offcut from "../offcuts/Offcut";

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

interface Exit {
  date: Date;
  offcuts: OffCutQuantity[];
}

export const exitSchema = new Schema<Exit>(
  {
    date: {
      type: Date,
      required: true,
    },
    offcuts: [OffCutQuantitySchema],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

exitSchema.plugin(normalize);

type ExitType = mongoose.Model<
  Exit,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, Exit> &
    Exit &
    Required<{
      _id: Schema.Types.ObjectId;
    }>,
  any
>;

export default (mongoose.models.Exit as unknown as ExitType) ||
  mongoose.model<Exit>("Exit", exitSchema);
