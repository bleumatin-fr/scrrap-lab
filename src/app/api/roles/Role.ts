import mongoose, { Model, Schema, model } from "mongoose";
import normalize from "normalize-mongoose";
import availableActions from "./availableActions";

export interface Role {
  name: string;
  actions: typeof availableActions;
  createdAt?: Date;
  updatedAt?: Date;
}

export const roleSchema = new Schema<Role>(
  {
    name: {
      type: String,
      required: true,
    },
    actions: [
      {
        type: String,
        enum: availableActions,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

roleSchema.plugin(normalize);

export default (mongoose.models?.Role as Model<Role>) ||
  model<Role>("Role", roleSchema);
