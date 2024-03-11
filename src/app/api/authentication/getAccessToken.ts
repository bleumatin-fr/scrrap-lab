import { HydratedDocument } from "mongoose";
import { User } from "../users/User";
import jwt from "jsonwebtoken";

const getAccessToken = async (user: HydratedDocument<User>) => {
  if (!process.env.JWT_EXPIRY) {
    throw new Error("Environment variable JWT_EXPIRY not set");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("Environment variable JWT_SECRET not set");
  }

  const payload = { _id: user._id };

  const accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: Number(process.env.JWT_EXPIRY),
  });
  
  return accessToken;
};

export default getAccessToken;
