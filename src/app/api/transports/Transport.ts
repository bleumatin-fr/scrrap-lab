import mongoose, { Schema } from "mongoose";
import normalize from "normalize-mongoose";
import { ExtractInterface } from "../db";
import List from "../[listCategory]/List";

interface Transport {
  date: Date;
  mode: ExtractInterface<typeof List>;
  consumption: number;
  distance?: number;
  weight?: number;
  passengers?: number;
  reason: ExtractInterface<typeof List>;
  from: GeoJSON.Feature;
  to: GeoJSON.Feature;
  createdAt?: Date;
  updatedAt?: Date;
}
const geometrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "Point",
      "MultiPoint",
      "LineString",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
    ],
  },
  coordinates: [],
});

const featureSchema = new mongoose.Schema({
  id: {
    type: "String",
  },
  type: {
    type: String,
    default: "Feature",
  },
  properties: {
    type: "Object",
  },
  geometry: geometrySchema,
});

export const transportSchema = new Schema<Transport>(
  {
    date: { type: Date },
    mode: { type: Schema.Types.ObjectId, ref: "List" },
    consumption: { type: Number },
    distance: { type: Number },
    weight: { type: Number },
    passengers: { type: Number },
    reason: { type: Schema.Types.ObjectId, ref: "List" },
    from: { type: featureSchema },
    to: { type: featureSchema },
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
