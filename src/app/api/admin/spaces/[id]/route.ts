import { NextResponse } from "next/server";
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { name, description, pricePerHour, isActive } = body;

    const space = await prisma.space.update({
      where: { id },
      data: {
        name: name,
        description: description,
        pricePerHour: pricePerHour,
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
    });

    return NextResponse.json(space, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
