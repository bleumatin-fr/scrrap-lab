export const dynamic = "force-dynamic";

import jwt from "jsonwebtoken";
import { FilterQuery, SortOrder } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";
import { connect } from "../../db";
import { handleErrors } from "../../errorHandler";
import { mail, send } from "../../mail";
import User from "../User";
import xlsx from "xlsx";
import Role from "../../roles/Role";

const columnsConfiguration = {
  lastName: 0,
  firstName: 1,
  email: 2,
  meta: 3,
  role: 4,
};

export const POST = handleErrors(async (request: NextRequest) => {
  await connect();
  await authenticate(request);
  await allow(request, ["users.edit"]);

  const formData = await request.formData();

  const file = formData.get("file")?.valueOf() as File;

  const workbook = xlsx.read(Buffer.from(await file.arrayBuffer()), {
    type: "buffer",
  });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  if (!process.env.RESET_PASSWORD_TOKEN_SECRET) {
    throw new Error("Environment variable RESET_PASSWORD_TOKEN_SECRET not set");
  }
  if (!process.env.RESET_PASSWORD_TOKEN_EXPIRY) {
    throw new Error("Environment variable RESET_PASSWORD_TOKEN_EXPIRY not set");
  }
  if (!process.env.BASE_URL) {
    throw new Error("Environment variable BASE_URL not set");
  }
  if (!process.env.MAIL_FROM) {
    throw new Error("Environment variable MAIL_FROM not set");
  }

  const rowsInError: any[][] = [];
  let updatedCount = 0;
  let addedCount = 0;

  for (const row of data.slice(1)) {
    try {
      const email = row[columnsConfiguration.email];
      if (!email) {
        rowsInError.push(row);
        continue;
      }
      const foundUser = await User.findOne({
        email,
      });
      const role = await Role.findOne({
        name: row[columnsConfiguration.role],
      });
      if (!role) {
        throw new Error(`Role ${row[columnsConfiguration.role]} not found`);
      }
      if (!foundUser) {
        //create and send mail
        const addedDocument = await User.create({
          firstName: row[columnsConfiguration.firstName],
          lastName: row[columnsConfiguration.lastName],
          meta: row[columnsConfiguration.meta],
          email,
          role: role?._id,
        });

        const payload = {
          id: addedDocument._id,
        };

        const token = jwt.sign(
          payload,
          process.env.RESET_PASSWORD_TOKEN_SECRET,
          {
            expiresIn: Number(process.env.RESET_PASSWORD_TOKEN_EXPIRY),
          }
        );

        addedDocument.resetPasswordToken = token;
        await addedDocument.save();

        await send({
          to: email,
          from: process.env.MAIL_FROM,
          ...(await mail("account-created", {
            user: addedDocument,
            link: `${process.env.BASE_URL}/activate/${token}`,
          })),
        });
        addedCount++;
        continue;
      }

      foundUser.firstName = row[columnsConfiguration.firstName];
      foundUser.lastName = row[columnsConfiguration.lastName];
      foundUser.meta = row[columnsConfiguration.meta];
      foundUser.role = role;

      await foundUser.save();
      updatedCount++;
    } catch (e) {
      rowsInError.push(row);
    }
  }

  return NextResponse.json(
    {
      rowsInError,
      updatedCount,
      addedCount,
    },
    { status: 200 }
  );
});
