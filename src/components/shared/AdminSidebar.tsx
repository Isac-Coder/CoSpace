import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-6 space-y-6">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-4">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/admin" className="p-2 hover:bg-gray-800 rounded transition">Dashboard</Link>
        <Link href="/admin/spaces" className="p-2 hover:bg-gray-800 rounded transition">Gestionar Espacios</Link>
        <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded transition">Volver al Usuario</Link>
      </nav>
    </aside>
  );
}
