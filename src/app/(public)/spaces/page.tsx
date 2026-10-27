import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function SpacesPage() {
  // SSR: Fetch data on every request
  const spaces = await prisma.space.findMany({
    where: { isActive: true },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Espacios Disponibles</h1>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {spaces.map((space) => (
          <div key={space.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
            <div className="relative h-40 w-full bg-gray-200">
              <Image 
                src={`https://picsum.photos/seed/${space.id}/400/300`} 
                alt={space.name} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{space.name}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{space.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">${Number(space.pricePerHour)}/hr</span>
                <Link 
                  href={`/spaces/${space.id}`} 
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 transition"
                >
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
