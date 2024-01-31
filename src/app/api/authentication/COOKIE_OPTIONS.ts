const dev = process.env.NODE_ENV === "development";

if (!process.env.REFRESH_TOKEN_EXPIRY) {
  throw new Error("Environment variable REFRESH_TOKEN_EXPIRY not set");
}

const COOKIE_OPTIONS: any = {
  httpOnly: true,
  secure: !dev,
  maxAge: process.env.REFRESH_TOKEN_EXPIRY,
  sameSite: dev ? "lax" : "none",
};

export default COOKIE_OPTIONS;
