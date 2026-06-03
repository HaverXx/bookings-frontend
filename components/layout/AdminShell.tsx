"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`admin-shell ${isCollapsed ? "admin-shell--collapsed" : ""}`}>
      <Sidebar />
      <div className="admin-main">
        <Header />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </SidebarProvider>
  );
}
