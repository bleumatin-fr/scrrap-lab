import mongoose, { Model, Schema, model } from "mongoose";
import normalize from "normalize-mongoose";
import { ExtractInterface } from "../db";
import List from "../[listCategory]/List";
import { Mode } from "fs";

interface Investment {
  type: ExtractInterface<typeof List>;
  condition: ExtractInterface<typeof List>;
  name: string;
  reference: string;
  weight: number;
  usagePeriod: number;
  usageStart: Date;
  quantity: number;
  meta: any;
}

export const investmentSchema = new Schema<Investment>(
  {
    type: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    condition: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    usagePeriod: {
      type: Number,
      required: true,
    },
    usageStart: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    meta: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

investmentSchema.plugin(normalize);

export default (mongoose.models?.Investment as Model<Investment>) ||
  model<Investment>("Investment", investmentSchema);
