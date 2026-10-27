"use client";

import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react";

type Space = { id: string; name: string; description: string; pricePerHour: number | string; isActive: boolean; createdAt?: string };
const money = (value: number | string) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value));

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Space | null>(null);
  const [form, setForm] = useState({ name: "", description: "", pricePerHour: "" });

  const loadSpaces = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/spaces", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible cargar los espacios.");
      setSpaces(Array.isArray(data) ? data : []);
    } catch (e) { setError(e instanceof Error ? e.message : "Error inesperado."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadSpaces(); }, [loadSpaces]);

  const openNew = () => { setEditing(null); setForm({ name: "", description: "", pricePerHour: "" }); setError(""); };
  const openEdit = (space: Space) => { setEditing(space); setForm({ name: space.name, description: space.description, pricePerHour: String(space.pricePerHour) }); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const response = await fetch(editing ? `/api/admin/spaces/${editing.id}` : "/api/admin/spaces", {
        method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pricePerHour: Number(form.pricePerHour) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible guardar el espacio.");
      setForm({ name: "", description: "", pricePerHour: "" }); setEditing(null); await loadSpaces();
    } catch (e) { setError(e instanceof Error ? e.message : "Error inesperado."); }
    finally { setSaving(false); }
  };
  const toggleActive = async (space: Space) => {
    if (space.isActive && !confirm(`¿Desactivar “${space.name}”? Si tiene reservas futuras, la operación puede rechazarse.`)) return;
    setError("");
    try {
      if (space.isActive) {
        const response = await fetch(`/api/admin/spaces/${space.id}/deactivate`, { method: "PATCH" });
        const data = await response.json(); if (!response.ok) throw new Error(data.error || "No se pudo desactivar.");
      } else {
        const response = await fetch(`/api/admin/spaces/${space.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: space.name, description: space.description, pricePerHour: Number(space.pricePerHour), isActive: true }) });
        const data = await response.json(); if (!response.ok) throw new Error(data.error || "No se pudo actualizar.");
        await loadSpaces();
      }
      await loadSpaces();
    } catch (e) { setError(e instanceof Error ? e.message : "Error inesperado."); }
  };
  const visible = spaces.filter(s => (filter === "all" || (filter === "active" ? s.isActive : !s.isActive)) && `${s.name} ${s.description}`.toLowerCase().includes(query.toLowerCase()));
  const activeCount = spaces.filter(s => s.isActive).length;

  return <main className="min-h-screen bg-[#0a0f1c] px-4 py-6 text-slate-100 sm:px-7 lg:px-10 lg:py-9">
    <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-blue-400">CoSpace / Administración</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Gestión de espacios</h1><p className="mt-2 text-sm text-slate-400">Crea, actualiza y controla la disponibilidad de tus espacios.</p></div><button onClick={openNew} className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">＋ Nuevo espacio</button></header>
    <section className="mb-6 grid gap-4 sm:grid-cols-3"><Metric label="Total de espacios" value={String(spaces.length)} hint="Registrados en la plataforma" icon="◈"/><Metric label="Activos" value={String(activeCount)} hint="Disponibles para reservar" icon="✓"/><Metric label="Inactivos" value={String(spaces.length-activeCount)} hint="Ocultos del catálogo" icon="◌"/></section>
    {error && <div role="alert" className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
    <section className="mb-6 rounded-2xl border border-white/[.08] bg-[#111827] p-5 sm:p-6"><div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-semibold">{editing ? "Editar espacio" : "Crear espacio"}</h2><p className="mt-1 text-xs text-slate-500">Los campos marcados son obligatorios.</p></div>{editing && <button onClick={openNew} className="text-sm text-slate-400 hover:text-white">Cancelar edición</button>}</div>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2"><Field label="Nombre del espacio"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ej. Sala de reuniones Aurora" className={inputClass}/></Field><Field label="Precio por hora (COP)"><input required type="number" min="1" step="100" value={form.pricePerHour} onChange={e=>setForm({...form,pricePerHour:e.target.value})} placeholder="25000" className={inputClass}/></Field><Field label="Descripción" wide><textarea required rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe capacidad, servicios y características del espacio..." className={inputClass}/></Field><div className="md:col-span-2 flex justify-end"><button disabled={saving} className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50">{saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear espacio"}</button></div></form>
    </section>
    <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#111827]"><div className="flex flex-col gap-4 border-b border-white/[.07] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Todos los espacios</h2><p className="mt-1 text-xs text-slate-500">{visible.length} resultado(s)</p></div><div className="flex flex-col gap-2 sm:flex-row"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar espacio..." className="rounded-lg border border-white/10 bg-[#0a0f1c] px-3 py-2 text-sm text-white outline-none focus:border-blue-400"/><select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-lg border border-white/10 bg-[#0a0f1c] px-3 py-2 text-sm text-slate-200"><option value="all">Todos los estados</option><option value="active">Activos</option><option value="inactive">Inactivos</option></select></div></div>
      {loading ? <div className="p-12 text-center text-sm text-slate-400">Cargando espacios...</div> : visible.length === 0 ? <div className="p-12 text-center"><p className="font-medium">No encontramos espacios</p><p className="mt-1 text-sm text-slate-500">Prueba otro filtro o crea un nuevo espacio.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-white/[.025] text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4 font-medium">Espacio</th><th className="px-5 py-4 font-medium">Precio / hora</th><th className="px-5 py-4 font-medium">Estado</th><th className="px-5 py-4 text-right font-medium">Acciones</th></tr></thead><tbody className="divide-y divide-white/[.06]">{visible.map(space=><tr key={space.id} className="transition hover:bg-white/[.025]"><td className="px-5 py-4"><p className="font-medium text-slate-100">{space.name}</p><p className="mt-1 max-w-sm truncate text-xs text-slate-500">{space.description}</p></td><td className="px-5 py-4 font-medium text-slate-200">{money(space.pricePerHour)}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${space.isActive ? "bg-emerald-400/10 text-emerald-300" : "bg-slate-400/10 text-slate-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${space.isActive ? "bg-emerald-400" : "bg-slate-500"}`}/>{space.isActive ? "Activo" : "Inactivo"}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={()=>openEdit(space)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5">Editar</button><button onClick={()=>void toggleActive(space)} className={`rounded-lg border px-3 py-2 text-xs ${space.isActive ? "border-rose-400/20 text-rose-300 hover:bg-rose-400/10" : "border-emerald-400/20 text-emerald-300 hover:bg-emerald-400/10"}`}>{space.isActive ? "Desactivar" : "Activar"}</button></div></td></tr>)}</tbody></table></div>}
    </section>
  </main>;
}
const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10";
function Field({label,wide,children}:{label:string;wide?:boolean;children:ReactNode}) { return <label className={`block text-sm font-medium text-slate-300 ${wide?"md:col-span-2":""}`}>{label}{children}</label>; }
function Metric({label,value,hint,icon}:{label:string;value:string;hint:string;icon:string}) { return <article className="rounded-2xl border border-white/[.08] bg-[#111827] p-5"><div className="flex items-center justify-between"><span className="text-sm text-slate-400">{label}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-400/10 text-blue-300">{icon}</span></div><p className="mt-4 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-slate-500">{hint}</p></article>; }
