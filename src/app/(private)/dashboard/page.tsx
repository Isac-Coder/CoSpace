"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Reservation {
  id: string;
  space: { name: string };
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reservations")
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Cargando reservas...</div>;

  const nextReservation = reservations.filter(r => new Date(r.startTime) > new Date())[0];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Dashboard</h1>
        <Link href="/spaces" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          Reservar Nuevo Espacio
        </Link>
      </div>

      {nextReservation && (
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Próxima Reserva</h2>
          <p className="text-2xl font-bold text-blue-950">{nextReservation.space.name}</p>
          <p className="text-blue-800">
            {new Date(nextReservation.startTime).toLocaleString()}
          </p>
        </section>
      )}

      <h2 className="text-2xl font-bold mb-6">Mis Reservas</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-500">No tienes reservas registradas.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div key={res.id} className="bg-white border p-4 rounded-xl shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold">{res.space.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(res.startTime).toLocaleString()} - {new Date(res.endTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${res.totalPrice}</p>
                <span className={`px-2 py-1 rounded text-xs ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {res.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
