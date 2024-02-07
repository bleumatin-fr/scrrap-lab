import { NextResponse } from "next/server";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";
import { connect } from "../../db";
import { HttpError, handleErrors } from "../../errorHandler";
import User from "../User";
import bcrypt from "bcrypt";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["users.list"]);

    const document = await User.findOne({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);

export const PUT = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    try {
      // if has rights
      await allow(request, ["users.edit"]);
    } catch (error) {
      // or if is the user itself
      if (!request.user || params.id !== request.user._id) {
        throw error;
      }
    }

    const {
      firstName,
      lastName,
      company,
      email,
      role,
      currentPassword,
      newPassword,
    } = await request.json();

    let modifications: any = {
      firstName,
      lastName,
      company,
      email,
      role,
    };

    if (currentPassword && newPassword) {
      let user = await User.findById(params.id).populate("role");
      if (!user || !user.hash) {
        throw new HttpError(401, "Unauthorized");
      }

      let verifiedPassword = await bcrypt.compare(currentPassword, user.hash);
      if (!verifiedPassword) {
        throw new HttpError(401, "Unauthorized");
      }

      const salt = await bcrypt.genSalt(
        Number(process.env.PASSWORD_SALT_ROUND) || 10
      );
      modifications.hash = await bcrypt.hash(newPassword, salt);
    }

    const updatedDocument = await User.findOneAndUpdate(
      {
        _id: params.id,
      },
      {
        $set: modifications,
      },
      { new: true }
    );

    return NextResponse.json(updatedDocument);
  }
);

export const DELETE = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    await allow(request, ["users.delete"]);

    const document = await User.findOne({
      _id: params.id,
    });

    await User.findOneAndDelete({
      _id: params.id,
    });

    return NextResponse.json(document);
  }
);
