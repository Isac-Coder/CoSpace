import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
const money=(v:number)=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(v);
export default async function HomePage(){
// Importa el tipo Space desde el cliente generado
import { Prisma } from "@/generated";

// ... (dentro de HomePage)
  let spaces: Prisma.SpaceGetPayload<{}>[] = [];
  try {
    spaces = await prisma.space.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("No se pudieron cargar los espacios:", error);
  }

  return (
    <main className="min-h-screen bg-[#080d18] text-white">
      <section className="relative isolate overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="pointer-events-none absolute -right-32 -top-20 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Espacios para ideas extraordinarias
            </span>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Tu próxima gran idea necesita{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                el espacio correcto.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Reserva escritorios y salas de trabajo sin complicaciones. Tú eliges el espacio, nosotros te ayudamos a enfocarte.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/spaces"
                className="rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Explorar espacios ↗
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-white/10 bg-white/[.04] px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[.08]"
              >
                Crear una cuenta
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
              <span>✓ Reserva en pocos pasos</span>
              <span>✓ Horarios flexibles</span>
              <span>✓ Todo desde un solo lugar</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-violet-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827] p-3 shadow-2xl">
              <div className="relative h-[320px] overflow-hidden rounded-[1.5rem] sm:h-[410px]">
                <Image
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                  alt="Oficina de coworking moderna"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold">Un lugar para crear</p>
                  <p className="mt-1 text-sm text-slate-500">Tu espacio de trabajo te espera</p>
                </div>
                <span className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                  Disponible hoy
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-[#111827] p-4 shadow-xl sm:block">
              <p className="text-xs text-slate-500">Tu siguiente paso</p>
              <p className="mt-1 font-semibold">
                Encuentra tu espacio ideal <span className="text-blue-300">↗</span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/[.06] bg-white/[.015] px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          <Benefit number="01" title="Explora" text="Compara espacios y encuentra el que encaja con tu jornada." />
          <Benefit number="02" title="Reserva" text="Elige fecha y horario con un proceso claro y sencillo." />
          <Benefit number="03" title="Concéntrate" text="Llega con todo listo para hacer que las cosas pasen." />
        </div>
      </section>
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-400">Selección CoSpace</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Espacios destacados</h2>
              <p className="mt-2 text-sm text-slate-400">Lugares listos para tu próxima sesión.</p>
            </div>
            <Link href="/spaces" className="hidden text-sm font-semibold text-blue-300 hover:text-blue-200 sm:block">
              Ver todos →
            </Link>
          </div>
          {spaces.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[.03] p-8 text-slate-400">
              Pronto encontrarás aquí nuestros espacios destacados.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {spaces.map((space) => (
                <article key={space.id} className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#111827]">
                  <div className="relative h-48">
                    <Image
                      src={`https://picsum.photos/seed/${space.id}/700/450`}
                      alt={space.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{space.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{space.description}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="font-semibold">
                        {money(Number(space.pricePerHour))}
                        <span className="ml-1 text-xs font-normal text-slate-500">/ hora</span>
                      </p>
                      <Link href={`/spaces/${space.id}`} className="text-sm font-semibold text-blue-300">
                        Ver detalle →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="mt-6 sm:hidden">
            <Link href="/spaces" className="text-sm font-semibold text-blue-300">
              Ver todos los espacios →
            </Link>
          </div>
        </div>
      </section>
      <section className="px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-3xl border border-blue-400/15 bg-gradient-to-r from-blue-500/10 via-[#111827] to-violet-500/10 p-7 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">¿Listo para encontrar tu lugar?</h2>
            <p className="mt-2 text-sm text-slate-400">Explora las opciones y reserva en unos pocos pasos.</p>
          </div>
          <Link
            href="/spaces"
            className="w-fit rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400"
          >
            Buscar un espacio ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
function Benefit({number,title,text}:{number:string;title:string;text:string}){return <div className="flex gap-4"><span className="pt-1 text-xs font-semibold tracking-widest text-blue-400">{number}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div>}
