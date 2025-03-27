import { NextResponse } from "next/server";
import * as mdiIcons from "@mdi/js";

/**
 * API untuk mendapatkan daftar ikon dengan pagination dan pencarian
 * @param {Request} req - Request dari client
 * @returns {NextResponse} - Response dengan daftar ikon
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // Filter ikon berdasarkan query pencarian
  const iconList = Object.entries(mdiIcons)
    .filter(([key]) => key.startsWith("mdi") && key.toLowerCase().includes(query.toLowerCase()))
    .slice(offset, offset + limit)
    .map(([key, path]) => ({ name: key, path }));

  return NextResponse.json(iconList);
}
