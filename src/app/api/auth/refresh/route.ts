import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth/jwt";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 401 });
    }

    const decoded = verifyRefreshToken(refreshToken) as any;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const newAccessToken = signAccessToken({ userId: user.id, role: user.role });

    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
    });

    return NextResponse.json({ message: "Token refreshed" }, { status: 200 });
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
    