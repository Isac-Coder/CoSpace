import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const spaces = await prisma.space.findMany({
    where: { isActive: true },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-20">
        <section className="text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Reserva tu espacio ideal en <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">CoSpace</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            La plataforma definitiva para encontrar escritorios, salas y cabinas.
          </p>
          <Link 
            href="/spaces" 
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Explorar Espacios
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          {spaces.map((space) => (
            <div key={space.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="relative h-56 w-full mb-6 rounded-2xl overflow-hidden bg-gray-800">
                <Image 
                  src={`https://picsum.photos/seed/${space.id}/400/300`} 
                  alt={space.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">{space.name}</h3>
              <p className="text-gray-400 mb-6 line-clamp-2">{space.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-bold text-xl">${Number(space.pricePerHour)}/hr</span>
                <Link 
                  href={`/spaces/${space.id}`} 
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition"
                >
                  Ver detalle &rarr;
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}