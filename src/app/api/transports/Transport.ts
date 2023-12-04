import mongoose, { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

enum TransportMode {
  CAR = "CAR",
  TRAIN = "TRAIN",
  BUS = "BUS",
  PLANE = "PLANE",
  BOAT = "BOAT",
}

interface Transport {
  mode: TransportMode;
  distance?: number;
  weight?: number;
  passengers?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const transportSchema = new Schema<Transport>(
  {
    mode: {
      type: String,
      enum: Object.values(TransportMode),
      required: true,
    },
    distance: { type: Number },
    weight: { type: Number },
    passengers: { type: Number },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

transportSchema.plugin(normalize);

type TransportType = mongoose.Model<
  Transport,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, Transport> &
    Transport &
    Required<{
      _id: Schema.Types.ObjectId;
    }>,
  any
>;

export default (mongoose.models.Transport as unknown as TransportType) ||
  mongoose.model<Transport>("Transport", transportSchema);
