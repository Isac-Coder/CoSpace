import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // SSG: Data is fetched at build time
  const spaces = await prisma.space.findMany({
    where: { isActive: true },
    take: 3,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Encuentra tu espacio ideal de <span className="text-blue-600">Coworking</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Reserva escritorios, salas de reuniones y cabinas privadas en segundos.
        </p>
        <Link 
          href="/spaces" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          Explorar Espacios
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {spaces.map((space) => (
          <div key={space.id} className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition">
            <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden bg-gray-200">
              <Image 
                src={`https://picsum.photos/seed/${space.id}/400/300`} 
                alt={space.name} 
                fill 
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">{space.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{space.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-lg">${Number(space.pricePerHour)}/hr</span>
              <Link 
                href={`/spaces/${space.id}`} 
                className="text-sm font-medium text-gray-500 hover:text-blue-600 transition"
              >
                Ver detalle &rarr;
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
