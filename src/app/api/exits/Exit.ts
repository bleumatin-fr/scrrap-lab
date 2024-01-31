import mongoose, { Model, Schema, model } from "mongoose";
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
  validatedAt?: Date;
  validatedBy?: string;
}

export const exitSchema = new Schema<Exit>(
  {
    date: {
      type: Date,
      required: true,
    },
    offcuts: [OffCutQuantitySchema],
    validatedAt: {
      type: Date,
    },
    validatedBy: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

exitSchema.plugin(normalize);

export default (mongoose.models?.Exit as Model<Exit>) ||
  model<Exit>("Exit", exitSchema);
