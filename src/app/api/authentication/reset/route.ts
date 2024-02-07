import { NextRequest, NextResponse } from "next/server";
import User from "../../users/User";
import { connect } from "../../db";
import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { HttpError, handleErrors } from "../../errorHandler";

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();

  const { token: resetPasswordToken, password } = await request.json();
  const user = await User.findOne({ resetPasswordToken });

  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }

  if (!process.env.RESET_PASSWORD_TOKEN_SECRET) {
    throw new Error("Environment variable RESET_PASSWORD_TOKEN_SECRET not set");
  }

  try {
    const payload: any = jwt.verify(
      resetPasswordToken,
      process.env.RESET_PASSWORD_TOKEN_SECRET
    );

    if (payload.id !== user._id.toString()) {
      throw new HttpError(401, "Invalid token");
    }

    const salt = await bcrypt.genSalt(
      Number(process.env.PASSWORD_SALT_ROUND) || 10
    );
    const hashPassword = await bcrypt.hash(password, salt);
    user.hash = hashPassword;
    user.resetPasswordToken = undefined;

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new HttpError(401, "Token expired");
    }
    throw error;
  }
});
