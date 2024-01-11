import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
