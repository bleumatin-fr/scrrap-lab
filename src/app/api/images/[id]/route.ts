import fs from "fs";
import allow from "../../authentication/allow";
import authenticate from "../../authentication/authenticate";
import { connect } from "../../db";
import { handleErrors } from "../../errorHandler";

export const GET = handleErrors(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    await authenticate(request);
    // await allow(request, ["offcuts.list", "catalog.list"]);

    const filePath = `./public/uploads/${params.id}`;
    const buffer = fs.readFileSync(filePath);

    const headers = new Headers();
    headers.append(
      "Content-Disposition",
      `attachment; filename="${params.id}.jpg"`
    );
    headers.append("Content-Type", "image/jpeg");

    return new Response(buffer, {
      headers,
    });
  }
);
