import { NextResponse } from "next/server";

export class HttpError extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

type ApiRoute = (
  req: NextRequest,
  params?: any
) => Response | Promise<Response>;


export const handleErrors = (fn: ApiRoute) => {
  return async (req: NextRequest, params?: any) => {
    try {
      return await fn(req, params);
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        return NextResponse.json(
          { message: error.message, error },
          {
            status: error.status || 500,
          }
        );
      }

      if (error instanceof Error) {
        return NextResponse.json(
          { message: error.message, error },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json(
        { message: "Internal server error", error },
        {
          status: 500,
        }
      );
    }
  }
};
