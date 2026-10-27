import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@/generated";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { verifyRefreshToken } from "@/lib/auth/jwt";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken) as any;
      if (decoded) {
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { refreshToken: null },
        });
      }
    }

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
