import { PrismaClient } from "@/generated";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// ...existing code...

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cospace.com" },
    update: {},
    create: {
      email: "admin@cospace.com",
      name: "Admin CoSpace",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });

  const spaces = [
    {
      name: "Escritorio Individual A1",
      description: "Escritorio ergonómico en zona silenciosa.",
      pricePerHour: 5.0,
    },
    {
      name: "Sala de Reuniones Executive",
      description: "Sala para 6 personas con pantalla y whiteboard.",
      pricePerHour: 20.0,
    },
    {
      name: "Cabina de Llamadas C1",
      description: "Cabina privada insonorizada para llamadas rápidas.",
      pricePerHour: 3.0,
    },
    {
      name: "Escritorio Compartido B2",
      description: "Espacio dinámico en zona de coworking.",
      pricePerHour: 4.0,
    },
    {
      name: "Sala de Conferencias Magna",
      description: "Espacio amplio para presentaciones hasta 15 personas.",
      pricePerHour: 40.0,
    },
  ];

  for (const space of spaces) {
    await prisma.space.create({
      data: space,
    });
  }

  console.log("Seed completed successfully: Admin and Spaces created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


