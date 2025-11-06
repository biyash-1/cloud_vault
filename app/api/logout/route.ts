import { NextResponse } from "next/server";
import { logoutUser } from "@/app/actions/user.action";
import { MATCHED_PATH_HEADER } from "next/dist/lib/constants";

export async function POST() {
  await logoutUser();
  return NextResponse.json({ success: true });
}