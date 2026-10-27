import Link from "next/link";

interface NavbarProps {
  userRole?: string;
}

export default function Navbar({ userRole }: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">CoSpace</Link>
        <div className="space-x-4">
          <Link href="/spaces" className="hover:underline">Espacios</Link>
          {userRole === "ADMIN" && (
            <Link href="/admin" className="bg-white text-blue-600 px-3 py-1 rounded font-medium">Panel Admin</Link>
          )}
          {userRole ? (
            <Link href="/dashboard" className="hover:underline">Mi Cuenta</Link>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="bg-white text-blue-600 px-3 py-1 rounded font-medium">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
