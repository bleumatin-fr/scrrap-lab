import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";
import bcrypt from "bcrypt";
import User from "../../users/User";
import { handleErrors } from "../../errorHandler";

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();

  const { email, firstName, lastName, meta, role, password } =
    await request.json();

  const salt = await bcrypt.genSalt(
    Number(process.env.PASSWORD_SALT_ROUND) || 10
  );
  const hashPassword = await bcrypt.hash(password, salt);

  const userToRegister = new User({
    email,
    firstName,
    lastName,
    meta,
    role,
    hash: hashPassword,
  });

  return NextResponse.json(await userToRegister.save());
});
