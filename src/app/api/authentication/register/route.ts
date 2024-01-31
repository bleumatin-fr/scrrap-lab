import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import bcrypt from "bcrypt";
import User from "../../users/User";

export async function POST(request: NextRequest) {
  await connect();

  const { email, firstName, lastName, company, role, password } =
    await request.json();

  const salt = await bcrypt.genSalt(
    Number(process.env.PASSWORD_SALT_ROUND) || 10
  );
  const hashPassword = await bcrypt.hash(password, salt);

  const userToRegister = new User({
    email: email,
    firstName: firstName,
    lastName: lastName,
    company: company,
    role,
    hash: hashPassword,
  });

  return NextResponse.json(await userToRegister.save());
}
