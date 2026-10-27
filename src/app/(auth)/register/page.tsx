"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const field =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#080d18] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo crear la cuenta."
        );
      }

      router.push("/login?registered=true");
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
    <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-[#080d18] px-4 py-10 text-white">
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
              Empieza hoy
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Tu próximo gran proyecto empieza aquí.
            </h2>

            <p className="mt-5 max-w-sm leading-7 text-slate-400">
              Crea tu cuenta, descubre espacios de trabajo
              y encuentra el lugar ideal para tus ideas.
            </p>

            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500/15 text-blue-300">
                  ✓
                </span>
                Explora espacios de coworking
              </p>

              <p className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500/15 text-blue-300">
                  ✓
                </span>
                Gestiona tus reservas
              </p>

              <p className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500/15 text-blue-300">
                  ✓
                </span>
                Administra todo desde tu cuenta
              </p>
            </div>
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

          <div className="mb-7 mt-5 md:mt-0">
            <span className="text-xs font-semibold uppercase tracking-[.2em] text-blue-400">
              Únete a CoSpace
            </span>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Crea tu cuenta
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Completa tus datos para comenzar.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Nombre completo

              <input
                required
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className={field}
              />
            </label>

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
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={field}
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Confirmar contraseña

              <input
                required
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className={field}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creando cuenta..."
                : "Crear cuenta →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-300 hover:text-blue-200"
            >
              Inicia sesión
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-slate-600">
            Al registrarte, aceptas las condiciones de uso
            y las políticas de privacidad de CoSpace.
          </p>
        </div>
      </section>
    </main>
  );
}