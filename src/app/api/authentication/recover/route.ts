import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import User from "../../users/User";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await connect();
  const { email } = await request.json();

  const user = await User.findOne({ email });

  if (!user) {
    // always return success, even if the email is not registered
    // to prevent email enumeration
    NextResponse.json({
      success: true,
    });
    return;
  }
  const payload = {
    id: user._id,
  };
  if (!process.env.RESET_PASSWORD_TOKEN_SECRET) {
    throw new Error("Environment variable RESET_PASSWORD_TOKEN_SECRET not set");
  }
  if (!process.env.JWT_EXPIRY) {
    throw new Error("Environment variable JWT_EXPIRY not set");
  }

  const token = jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, {
    expiresIn: Number(process.env.JWT_EXPIRY),
  });

  user.resetPasswordToken = token;
  await user.save();

  // TODO
  // await send({
  //   to: user.email,
  //   from: process.env.MAIL_FROM,
  //   ...recoverMail(token),
  // });

  return NextResponse.json({
    success: true,
    user,
  });
}
