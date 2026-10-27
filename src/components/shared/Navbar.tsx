"use client";

import Link from "next/link";
import { useState } from "react";

const translations = {
  es: {
    spaces: "Espacios",
    admin: "Panel Admin",
    account: "Mi Cuenta",
    login: "Login",
    register: "Registro",
  },
  en: {
    spaces: "Spaces",
    admin: "Admin Panel",
    account: "My Account",
    login: "Login",
    register: "Register",
  },
};

interface NavbarProps {
  userRole?: string;
}

export default function Navbar({ userRole }: NavbarProps) {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = translations[lang];

  return (
    <nav className="bg-gray-950 text-white p-4 shadow-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">CoSpace</Link>
        <div className="flex items-center space-x-6">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="text-sm bg-white/10 px-2 py-1 rounded">
            {lang.toUpperCase()}
          </button>
          <Link href="/spaces" className="hover:text-blue-400 transition">{t.spaces}</Link>
          {userRole === "ADMIN" && (
            <Link href="/admin" className="bg-blue-600 text-white px-3 py-1 rounded-full font-medium hover:bg-blue-700">{t.admin}</Link>
          )}
          {userRole ? (
            <Link href="/dashboard" className="hover:text-blue-400 transition">{t.account}</Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400 transition">{t.login}</Link>
              <Link href="/register" className="bg-emerald-600 text-white px-3 py-1 rounded-full font-medium hover:bg-emerald-700">{t.register}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
