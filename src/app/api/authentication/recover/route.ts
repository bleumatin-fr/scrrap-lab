import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import User from "../../users/User";
import jwt from "jsonwebtoken";
import { mail, send } from "../../mail";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { email } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      // always return success, even if the email is not registered
      // to prevent email enumeration
      return NextResponse.json({
        success: true,
      });
    }
    const payload = {
      id: user._id,
    };
    if (!process.env.RESET_PASSWORD_TOKEN_SECRET) {
      throw new Error(
        "Environment variable RESET_PASSWORD_TOKEN_SECRET not set"
      );
    }
    if (!process.env.JWT_EXPIRY) {
      throw new Error("Environment variable JWT_EXPIRY not set");
    }
    if (!process.env.BASE_URL) {
      throw new Error("Environment variable BASE_URL not set");
    }
    if (!process.env.MAIL_FROM) {
      throw new Error("Environment variable MAIL_FROM not set");
    }

    const token = jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, {
      expiresIn: Number(process.env.JWT_EXPIRY),
    });

    user.resetPasswordToken = token;
    await user.save();
    
    await send({
      to: user.email,
      from: process.env.MAIL_FROM,
      ...await mail("recover", {
        link: `${process.env.BASE_URL}/reset/${token}`,
      }),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    // always return success, even if the email is not registered
    // to prevent email enumeration
    return NextResponse.json({
      success: true,
    });
  }
}
