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

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const decoded = verifyAccessToken(token) as any;
  return decoded ? { userId: decoded.userId, role: decoded.role } : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });

    // Rule 9: Only owner or admin can cancel
    if (reservation.userId !== user.userId && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Rule 10: User can cancel up to 2 hours before start
    const now = new Date();
    const startTime = new Date(reservation.startTime);
    const diffInHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (user.role !== "ADMIN" && diffInHours < 2) {
      return NextResponse.json({ error: "Cannot cancel within 2 hours of start time" }, { status: 400 });
    }

    // Rule 11: Cancellation changes status to cancelled, not deleted
    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ message: "Reservation cancelled successfully" }, { status: 200 });
  } catch (error) {
    console.error("PATCH reservation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
