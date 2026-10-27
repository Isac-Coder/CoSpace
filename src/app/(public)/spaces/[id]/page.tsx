import ReservationForm from "@/components/ReservationForm";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function SpaceDetailPage({ params }: { params: { id: string } }) {
  const space = await prisma.space.findUnique({
    where: { id: params.id },
  });

  if (!space) notFound();

  return (
    <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-xl">
          <Image 
            src={`https://picsum.photos/seed/${space.id}/800/600`} 
            alt={space.name} 
            fill 
            className="object-cover"
          />
        </div>
        <div className="mt-8 p-6 bg-white rounded-2xl border shadow-sm">
          <h3 className="text-xl font-bold mb-4">Detalles del Espacio</h3>
          <p className="text-gray-600 leading-relaxed">{space.description}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold mb-2">{space.name}</h1>
        <p className="text-2xl text-blue-600 font-bold mb-6">${Number(space.pricePerHour)} por hora</p>
        
        <div className="bg-white p-8 rounded-3xl border shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Reservar este espacio</h3>
          <ReservationForm spaceId={space.id} pricePerHour={Number(space.pricePerHour)} />
        </div>
      </div>
    </div>
  );
}
