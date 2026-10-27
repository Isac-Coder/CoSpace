import AdminSidebar from "@/components/shared/AdminSidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
}
