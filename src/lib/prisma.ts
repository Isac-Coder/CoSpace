import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated";
import pg from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
