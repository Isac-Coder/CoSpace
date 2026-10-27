import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const decoded = verifyAccessToken(token) as any;
  return decoded && decoded.role === "ADMIN" ? decoded : null;
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const params = await context.params;
    const { id } = params;

    // Rule 13: Cannot deactivate space with future confirmed reservations
    const futureReservations = await prisma.reservation.count({
      where: {
        spaceId: id,
        status: "CONFIRMED",
        startTime: {
          gt: new Date(),
        },
      },
    });

    if (futureReservations > 0) {
      return NextResponse.json(
        { error: "Cannot deactivate space with confirmed future reservations" },
        { status: 409 }
      );
    }

    await prisma.space.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Space deactivated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Deactivate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
