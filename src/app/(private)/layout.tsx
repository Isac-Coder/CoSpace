import Navbar from "@/components/shared/Navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function PrivateLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userRole="USER" />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
