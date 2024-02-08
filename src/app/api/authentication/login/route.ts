import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import User from "../../users/User";
import bcrypt from "bcrypt";
import getAccessToken from "../getAccessToken";
import getRefreshToken from "../getRefreshToken";
import { cookies } from "next/headers";
import COOKIE_OPTIONS from "../COOKIE_OPTIONS";
import { HttpError, handleErrors } from "../../errorHandler";

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();

  const { email, password } = await request.json();

  let user = await User.findOne({ email }).populate("role");
  if (!user || !user.hash) {
    throw new HttpError(401, "Unauthorized");
  }

  let verifiedPassword = await bcrypt.compare(password, user.hash);
  if (!verifiedPassword) {
    throw new HttpError(401, "Unauthorized");
  }

  const accessToken = await getAccessToken(user);
  const refreshToken = await getRefreshToken(user);

  const now = new Date();

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      lastLogin: now,
      lastActive: now,
    }
  );

  cookies().set({
    name: "refreshToken",
    value: refreshToken,
    ...COOKIE_OPTIONS,
  });
  cookies().set({
    name: "accessToken",
    value: accessToken,
    ...COOKIE_OPTIONS,
  });

  return NextResponse.json(
    {
      success: true,
      token: accessToken,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      company: user.company,
      permissions: user.role.actions,
    },
    {}
  );
});
