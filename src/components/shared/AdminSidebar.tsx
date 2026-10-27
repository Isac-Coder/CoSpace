"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/spaces", label: "Espacios", icon: "◈" },
  { href: "/dashboard", label: "Vista de usuario", icon: "↗" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-white/[0.08] bg-[#0d1422] px-4 py-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:px-5 md:py-6">
      <Link href="/admin" className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-500/20">C</span>
        <span><span className="block text-lg font-semibold tracking-tight text-white">CoSpace</span><span className="block text-xs text-slate-500">Workspace admin</span></span>
      </Link>
      <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Menú principal</p>
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link key={link.href} href={link.href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-400/20" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"}`}>
              <span className="w-5 text-center text-base">{link.icon}</span>{link.label}
              {active && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-blue-300 md:block" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 hidden rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-500/10 to-transparent p-4 md:block">
        <p className="text-sm font-medium text-slate-200">Todo en un solo lugar</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">Administra espacios y mantén el control de las reservas de CoSpace.</p>
        <Link href="/spaces" className="mt-4 inline-flex text-xs font-semibold text-blue-300 hover:text-blue-200">Explorar catálogo →</Link>
      </div>
      <div className="mt-8 hidden border-t border-white/[0.07] pt-5 md:block">
        <Link href="/" className="text-sm text-slate-500 transition hover:text-slate-200">← Volver al sitio</Link>
      </div>
    </aside>
  );
}
