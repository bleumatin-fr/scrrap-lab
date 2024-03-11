import { NextResponse } from "next/server";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";
import { connect } from "../../db";
import { HttpError, handleErrors } from "../../errorHandler";
import User from "../User";
import bcrypt from "bcrypt";
import getAccessToken from "../../authentication/getAccessToken";
import { cookies } from "next/headers";
import COOKIE_OPTIONS from "../../authentication/COOKIE_OPTIONS";

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
      meta,
      email,
      role,
      currentPassword,
      newPassword,
    } = await request.json();

    let modifications: any = {};

    if (firstName) {
      modifications.firstName = firstName;
    }
    if (lastName) {
      modifications.lastName = lastName;
    }
    if (meta) {
      modifications.meta = meta;
    }
    if (email) {
      modifications.email = email;
    }
    if (role) {
      modifications.role = role;
    }

    if (currentPassword && newPassword) {
      let user = await User.findById(params.id).populate("role");
      if (!user || !user.hash) {
        throw new HttpError(403, "Forbidden");
      }

      let verifiedPassword = await bcrypt.compare(currentPassword, user.hash);
      if (!verifiedPassword) {
        throw new HttpError(403, "Forbidden");
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

    if (!updatedDocument) {
      throw new HttpError(404, "Not Found");
    }

    const finalUser = await User.findOne({
      _id: updatedDocument._id,
    }).populate("role");

    if(!finalUser) {
      throw new HttpError(404, "Not Found");
    }

    // access token has user info so we need to regenerate it
    const accessToken = await getAccessToken(finalUser);
    cookies().set({
      name: "accessToken",
      value: accessToken,
      ...COOKIE_OPTIONS,
    });

    return NextResponse.json({
      success: true,
      token: accessToken,
      id: finalUser._id,
      firstName: finalUser.firstName,
      lastName: finalUser.lastName,
      email: finalUser.email,
      meta: finalUser.meta,
      permissions: finalUser.role.actions,
    });
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
