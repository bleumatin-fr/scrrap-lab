import User, { Token, User as UserType } from "../users/User";
import { HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";

const getRefreshToken = async (user: HydratedDocument<UserType>) => {
  if (!process.env.REFRESH_TOKEN_EXPIRY) {
    throw new Error("Environment variable REFRESH_TOKEN_EXPIRY not set");
  }
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Environment variable REFRESH_TOKEN_SECRET not set");
  }
  const payload = { _id: user._id };
  const refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY),
  });
  
  const foundUser = await User.findById(user._id);

  if (!foundUser) {
    throw new Error("User not found");
  }

  const newRefreshToken = new Token({
    user: foundUser._id,
    value: refreshToken,
  });
  await newRefreshToken.save();

  return refreshToken;
};

export default getRefreshToken;
