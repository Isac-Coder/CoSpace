"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const field =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#080d18] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No pudimos iniciar sesión."
        );
      }

      router.push(
        data.role === "ADMIN" ? "/admin" : "/dashboard"
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-[#080d18] px-4 py-12 text-white">
      {/* Luces decorativas */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0e1626] shadow-2xl shadow-black/30 md:grid-cols-2">
        {/* Panel visual */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600/20 via-[#101a2c] to-violet-600/10 p-10 md:flex">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500 text-xl font-bold">
                C
              </span>

              <span className="text-xl font-semibold">
                CoSpace
              </span>
            </Link>

            <p className="mt-20 text-xs font-semibold uppercase tracking-[.25em] text-blue-300">
              Tu espacio, tu ritmo
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Un lugar para que tus mejores ideas sucedan.
            </h2>

            <p className="mt-5 max-w-sm leading-7 text-slate-400">
              Encuentra espacios diseñados para concentrarte,
              colaborar y llevar tus proyectos más lejos.
            </p>
          </div>

          <p className="text-xs text-slate-600">
            © CoSpace · Espacios para trabajar mejor
          </p>
        </div>

        {/* Formulario */}
        <div className="p-7 sm:p-10 md:p-12">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-white md:hidden"
          >
            ← Volver al inicio
          </Link>

          <div className="mb-8 mt-5 md:mt-0">
            <span className="text-xs font-semibold uppercase tracking-[.2em] text-blue-400">
              Qué bueno verte de nuevo
            </span>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Inicia sesión
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Ingresa tus datos para acceder a tu cuenta.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-slate-300">
              Correo electrónico

              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={field}
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Contraseña

              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className={field}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Ingresando..."
                : "Entrar a CoSpace →"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            ¿Aún no tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-300 hover:text-blue-200"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}