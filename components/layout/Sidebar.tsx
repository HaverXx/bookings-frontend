"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { label: t("nav.dashboard"), href: "/dashboard", icon: "◫" },
    { label: t("nav.bookings"), href: "/bookings", icon: "☰" },
    { label: t("nav.customers"), href: "/customers", icon: "◎" },
    { label: t("nav.payments"), href: "/payments", icon: "◌" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <h2 className="admin-sidebar__title">{t("app.brand")}</h2>
        <p className="admin-sidebar__subtitle">{t("app.workspace")}</p>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}