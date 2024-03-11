import { HttpError, handleErrors } from "../../errorHandler";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import User, { Token } from "../../users/User";
import COOKIE_OPTIONS from "../COOKIE_OPTIONS";
import getAccessToken from "../getAccessToken";
import getRefreshToken from "../getRefreshToken";

export const POST = handleErrors(async (request: NextRequest) => {
  try {
    await connect();
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new HttpError(401, "Unauthorized");
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("Environment variable REFRESH_TOKEN_SECRET not set");
    }
    const payload: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const userId = payload._id;
    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const token = await Token.find({
      value: refreshToken,
      user: user._id,
    });
    if (!token) {
      throw new HttpError(401, "Unauthorized");
    }

    const newToken = await getAccessToken(user);
    const newRefreshToken = await getRefreshToken(user);

    user.save();

    cookies().set({
      name: "refreshToken",
      value: newRefreshToken,
      ...COOKIE_OPTIONS,
    });
    cookies().set({
      name: "accessToken",
      value: newToken,
      ...COOKIE_OPTIONS,
    });

    return NextResponse.json(
      {
        success: true,
        token: newToken,
      },
      {}
    );
  } catch (e) {
    throw new HttpError(401, "Unauthorized");
  }
});
