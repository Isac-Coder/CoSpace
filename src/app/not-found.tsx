import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#080d18] px-4 py-12 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 text-slate-400">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <Link href="/" className="mt-8 inline-block rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
