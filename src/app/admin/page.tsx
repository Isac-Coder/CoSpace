import Link from "next/link";
import { prisma } from "@/lib/prisma";

const currency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  let stats = { activeSpaces: 0, totalSpaces: 0, todayReservations: 0, monthRevenue: 0, confirmedReservations: 0 };
  let recentReservations: { id: string; user: { name: string; email: string }; space: { name: string }; startTime: Date; totalPrice: { toNumber: () => number }; status: "CONFIRMED" | "CANCELLED" }[] = [];
  let weekCounts: number[] = Array(7).fill(0);
  let databaseAvailable = true;

  try {
    const [activeSpaces, totalSpaces, todayReservations, monthReservations, confirmedReservations, recent, weekReservations] = await Promise.all([
      prisma.space.count({ where: { isActive: true } }),
      prisma.space.count(),
      prisma.reservation.count({ where: { status: "CONFIRMED", startTime: { gte: todayStart, lt: tomorrow } } }),
      prisma.reservation.findMany({ where: { status: "CONFIRMED", createdAt: { gte: monthStart } }, select: { totalPrice: true } }),
      prisma.reservation.count({ where: { status: "CONFIRMED", endTime: { gte: now } } }),
      prisma.reservation.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, space: { select: { name: true } } },
      }),
      prisma.reservation.findMany({ where: { createdAt: { gte: weekStart }, status: "CONFIRMED" }, select: { createdAt: true } }),
    ]);
    stats = {
      activeSpaces,
      totalSpaces,
      todayReservations,
      monthRevenue: monthReservations.reduce((sum, item) => sum + Number(item.totalPrice), 0),
      confirmedReservations,
    };
    recentReservations = recent;
    weekCounts = weekCounts.map((_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      return weekReservations.filter((reservation) => {
        const created = new Date(reservation.createdAt);
        return created.getFullYear() === day.getFullYear() && created.getMonth() === day.getMonth() && created.getDate() === day.getDate();
      }).length;
    });
  } catch {
    databaseAvailable = false;
  }

  const maxCount = Math.max(...weekCounts, 1);
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const todayIndex = (now.getDay() + 6) % 7;
  const orderedDays = weekDays.map((day, i) => ({ day, count: weekCounts[i], active: i === todayIndex }));

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-100">
      <header className="flex flex-col gap-4 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">CoSpace / Administración</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Panel de control</h1>
          <p className="mt-1 text-sm text-slate-400">Resumen general de tu espacio de coworking.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/spaces" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/50 hover:bg-white/5">Ver catálogo ↗</Link>
          <Link href="/admin/spaces" className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">+ Gestionar espacios</Link>
        </div>
      </header>

      <main className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        {!databaseAvailable && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            No se pudieron cargar las estadísticas. Verifica la conexión a PostgreSQL y las migraciones de Prisma.
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Espacios activos" value={String(stats.activeSpaces)} detail={`${stats.totalSpaces} espacios registrados`} icon="▦" accent="blue" />
          <MetricCard label="Reservas de hoy" value={String(stats.todayReservations)} detail="Reservas confirmadas" icon="◷" accent="violet" />
          <MetricCard label="Ingresos del mes" value={currency(stats.monthRevenue)} detail="Reservas confirmadas creadas este mes" icon="$" accent="emerald" />
          <MetricCard label="Reservas próximas" value={String(stats.confirmedReservations)} detail="Con fecha de finalización futura" icon="↗" accent="amber" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Actividad semanal</h2>
                <p className="mt-1 text-sm text-slate-400">Reservas confirmadas por día de creación</p>
              </div>
              <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400">Últimos 7 días</span>
            </div>
            <div className="mt-8 flex h-48 items-end justify-between gap-3 border-b border-white/[0.08] pb-2">
              {orderedDays.map(({ day, count, active }) => (
                <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs text-slate-400">{count}</span>
                  <div className="flex w-full max-w-12 flex-1 items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${active ? "bg-blue-400 shadow-lg shadow-blue-500/20" : "bg-blue-500/35"}`}
                      style={{ height: `${Math.max((count / maxCount) * 100, 4)}%` }}
                      title={`${count} reservas`}
                    />
                  </div>
                  <span className={`text-xs ${active ? "font-semibold text-blue-300" : "text-slate-500"}`}>{day}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">Los datos se calculan a partir de las reservas almacenadas en la base de datos.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Estado del espacio</h2>
                <p className="mt-1 text-sm text-slate-400">Disponibilidad del catálogo</p>
              </div>
              <span className="text-xl text-blue-300">◈</span>
            </div>
            <div className="mt-7 flex items-center gap-5">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#60a5fa ${stats.totalSpaces ? (stats.activeSpaces / stats.totalSpaces) * 100 : 0}%, #273449 0)` }}>
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[#111827]">
                  <span className="text-2xl font-semibold">{stats.totalSpaces ? Math.round((stats.activeSpaces / stats.totalSpaces) * 100) : 0}%</span>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-400" /><span className="text-slate-300">Activos</span><strong className="ml-auto">{stats.activeSpaces}</strong></div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-600" /><span className="text-slate-300">Inactivos</span><strong className="ml-auto">{stats.totalSpaces - stats.activeSpaces}</strong></div>
              </div>
            </div>
            <Link href="/admin/spaces" className="mt-7 flex items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-300 transition hover:border-blue-400/40 hover:bg-white/[0.03]">
              Administrar catálogo <span className="text-blue-300">→</span>
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold">Reservas recientes</h2>
              <p className="mt-1 text-sm text-slate-400">Últimos movimientos registrados</p>
            </div>
            <Link href="/admin/reservations" className="text-sm font-medium text-blue-300 hover:text-blue-200">Ver todas →</Link>
          </div>
          {recentReservations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-xl text-slate-400">◷</div>
              <p className="mt-4 font-medium">Todavía no hay reservas</p>
              <p className="mt-1 text-sm text-slate-500">Cuando alguien reserve un espacio, aparecerá aquí.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                  <tr><th className="px-6 py-3 font-medium">Usuario</th><th className="px-6 py-3 font-medium">Espacio</th><th className="px-6 py-3 font-medium">Inicio</th><th className="px-6 py-3 font-medium">Total</th><th className="px-6 py-3 font-medium">Estado</th></tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {recentReservations.map((reservation) => (
                    <tr key={reservation.id} className="transition hover:bg-white/[0.025]">
                      <td className="px-6 py-4"><p className="font-medium text-slate-200">{reservation.user.name}</p><p className="mt-1 text-xs text-slate-500">{reservation.user.email}</p></td>
                      <td className="px-6 py-4 text-slate-300">{reservation.space.name}</td>
                      <td className="px-6 py-4 text-slate-400">{dateLabel(reservation.startTime)}</td>
                      <td className="px-6 py-4 font-medium text-slate-200">{currency(Number(reservation.totalPrice))}</td>
                      <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${reservation.status === "CONFIRMED" ? "bg-emerald-400/10 text-emerald-300" : "bg-slate-700/60 text-slate-300"}`}>{reservation.status === "CONFIRMED" ? "Confirmada" : "Cancelada"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value, detail, icon, accent }: { label: string; value: string; detail: string; icon: string; accent: "blue" | "violet" | "emerald" | "amber" }) {
  const styles = {
    blue: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
    emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  };
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#111827] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.14]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-semibold ring-1 ${styles[accent]}`}>{icon}</span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  );
}
