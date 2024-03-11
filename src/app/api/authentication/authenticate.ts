import { HttpError } from "../errorHandler";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { connect } from "../db";
import User from "../users/User";

const authenticate = async (request: NextRequest) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Environment variable JWT_SECRET not set");
  }
  let token = null;
  const authorization = request.headers.get("authorization");
  if (authorization) {
    token = authorization.split(" ")[1];
  } else if (request.cookies.get("accessToken")) {
    token = request.cookies.get("accessToken")?.value;
  }

  if (token) {
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET, {});
      if (!payload) {
        throw new HttpError(401, "Token expired");
      }
      await connect();
      const user = await User.findById(payload._id).populate("role");
      if (user) {
        request.user = user;
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpError(401, "Token expired");
      }
      throw error;
    }
  }
};

export default authenticate;