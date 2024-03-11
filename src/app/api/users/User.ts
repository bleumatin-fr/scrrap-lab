import mongoose, { Model, Schema, Types, model } from "mongoose";
import normalize from "normalize-mongoose";
import { Role as RoleType } from "../roles/Role";

if (!process.env.REFRESH_TOKEN_EXPIRY) {
  throw new Error("Environment variable REFRESH_TOKEN_EXPIRY not set");
}

export interface Token {
  user: Types.ObjectId;
  value: string;
  createdAt: Date;
}

export const tokenSchema = new Schema<Token>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  value: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: Number(process.env.REFRESH_TOKEN_EXPIRY),
  },
});

tokenSchema.plugin(normalize);

export const Token =
  (mongoose.models?.Token as Model<Token>) ||
  model<Token>("Token", tokenSchema);

export interface User {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  meta: string;
  email: string;
  hash?: string;
  resetPasswordToken?: string;
  role: RoleType;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    meta: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hash: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.hash;
    delete ret.resetPasswordToken;
    return ret;
  },
});

userSchema.plugin(normalize);

export default (mongoose.models?.User as Model<User>) ||
  model<User>("User", userSchema);
