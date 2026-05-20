"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      // Redirige y reemplaza TODO el historial
      window.location.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return <>{children}</>;
}