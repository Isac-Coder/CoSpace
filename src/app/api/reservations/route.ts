import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const reservations = await prisma.reservation.findMany({
      where: { userId: user.userId },
      include: { space: true },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("GET reservations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { spaceId, startTime, endTime } = body;

    if (!spaceId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // --- BUSINESS RULES ---

    // 1. Duration between 1 and 4 hours, full hours only
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 1 || durationHours > 4 || !Number.isInteger(durationHours)) {
      return NextResponse.json({ error: "Reservation must be between 1 and 4 full hours" }, { status: 400 });
    }

    // 2. Only between 07:00 and 21:00
    const startHour = start.getHours();
    const endHour = end.getHours();
    if (startHour < 7 || endHour > 21) {
      return NextResponse.json({ error: "Reservations only allowed between 07:00 and 21:00" }, { status: 400 });
    }

    // 3. Not in the past, not more than 30 days in advance
    if (start < now) {
      return NextResponse.json({ error: "Cannot reserve in the past" }, { status: 400 });
    }
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 30);
    if (start > maxDate) {
      return NextResponse.json({ error: "Cannot reserve more than 30 days in advance" }, { status: 400 });
    }

    // 7. Space must be active
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });
    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });
    if (!space.isActive) {
      return NextResponse.json({ error: "This space is currently deactivated" }, { status: 400 });
    }

    // 4. Space cannot have overlapping confirmed reservations
    const overlappingSpace = await prisma.reservation.findFirst({
      where: {
        spaceId,
        status: "CONFIRMED",
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } },
        ],
      },
    });
    if (overlappingSpace) {
      return NextResponse.json({ error: "Space is already reserved for this time slot" }, { status: 409 });
    }

    // 5. User cannot have overlapping confirmed reservations
    const overlappingUser = await prisma.reservation.findFirst({
      where: {
        userId: user.userId,
        status: "CONFIRMED",
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } },
        ],
      },
    });
    if (overlappingUser) {
      return NextResponse.json({ error: "You already have a reservation at this time" }, { status: 409 });
    }

    // 6. Max 3 future confirmed reservations per user
    const futureCount = await prisma.reservation.count({
      where: {
        userId: user.userId,
        status: "CONFIRMED",
        startTime: { gt: now },
      },
    });
    if (futureCount >= 3) {
      return NextResponse.json({ error: "Maximum 3 future reservations allowed" }, { status: 400 });
    }

    // 8. Calculate total price on server
    const totalPrice = durationHours * Number(space.pricePerHour);

    const reservation = await prisma.reservation.create({
      data: {
        userId: user.userId,
        spaceId,
        startTime: start,
        endTime: end,
        totalPrice: totalPrice,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("POST reservations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
