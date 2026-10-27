"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReservationFormProps {
  spaceId: string;
  pricePerHour: number;
}

export default function ReservationForm({ spaceId, pricePerHour }: ReservationFormProps) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const calculatePrice = (start: string, end: string) => {
    if (!start || !end) return;
    const s = new Date(start);
    const e = new Date(end);
    const hours = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
    setTotalPrice(hours * pricePerHour);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, startTime, endTime }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setSuccessMessage("¡Reserva exitosa!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-medium">
          {successMessage}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
          <input 
            type="datetime-local" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              calculatePrice(e.target.value, endTime);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
          <input 
            type="datetime-local" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              calculatePrice(startTime, e.target.value);
            }}
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl text-center">
        <p className="text-gray-600 text-sm">Precio estimado</p>
        <p className="text-3xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      
      {/* Nuevo mensaje de éxito */}
      {success && (
        <p className="text-emerald-500 text-sm font-medium text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          ¡Reserva exitosa! Redirigiendo a tu dashboard...
        </p>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Procesando..." : "Confirmar Reserva"}
      </button>
    </form>
  );
}