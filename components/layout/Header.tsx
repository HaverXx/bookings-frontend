"use client";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="admin-header">
      <div>
        <h1 className="admin-header__title">{t("app.title")}</h1>
        <p className="admin-header__subtitle">
          {t("app.subtitle")}
        </p>
      </div>
      <div className="admin-header__actions">
        <LanguageSwitcher />
        <ThemeToggle />
        <div className="admin-avatar">AD</div>
      </div>
    </header>
  );
}