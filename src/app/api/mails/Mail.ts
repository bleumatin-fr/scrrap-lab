import mongoose, { Model, Schema, model } from "mongoose";
import normalize from "normalize-mongoose";

export interface Mail {
  key: string;
  subject: string;
  html: string;
  text: string;
}

export const mailSchema = new Schema<Mail>(
  {
    key: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mailSchema.plugin(normalize);

export default (mongoose.models?.Mail as Model<Mail>) ||
  model<Mail>("Mail", mailSchema);
