"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggleLanguage = () => {
    const newLang = lang === "es" ? "en" : "es";
    setLang(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="secondary-btn"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        minWidth: "70px",
        justifyContent: "center"
      }}
      aria-label="Change language"
    >
      <span style={{ fontSize: "18px" }}>
        {lang === "es" ? "🇪🇸" : "🇬🇧"}
      </span>
      <span>{lang.toUpperCase()}</span>
    </button>
  );
}
