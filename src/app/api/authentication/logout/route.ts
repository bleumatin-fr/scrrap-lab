import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connect } from "../../db";
import User, { Token } from "../../users/User";
import { HttpError } from "../../errorHandler";

export async function POST(request: NextRequest) {
  await connect();

  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!request.user) {
    throw new Error("No user given");
  }

  const user = await User.findById(request.user._id);
  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }

  const token = await Token.findOne({
    value: refreshToken,
    user: user._id,
  });

  if (token) {
    await token.deleteOne();
  }

  cookies().delete("refreshToken");

  return NextResponse.json(
    {
      success: true,
    },
    {}
  );
}
