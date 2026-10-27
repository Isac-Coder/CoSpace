import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return false;
  
  const decoded = verifyAccessToken(token) as any;
  return decoded && decoded.role === "ADMIN";
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const spaces = await prisma.space.findMany();
    return NextResponse.json(spaces, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, pricePerHour } = body;

    if (!name || !description || !pricePerHour) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const space = await prisma.space.create({
      data: {
        name,
        description,
        pricePerHour: pricePerHour,
      },
    });

    return NextResponse.json(space, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
