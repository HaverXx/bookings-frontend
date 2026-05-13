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
        justifyContent: "center",
        width: "42px",
        height: "42px",
        padding: "0",
        borderRadius: "12px",
        transition: "all 0.2s ease",
        cursor: "pointer",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        overflow: "hidden"
      }}
      aria-label={lang === "es" ? "Cambiar a Inglés" : "Switch to Spanish"}
      title={lang === "es" ? "Cambiar a Inglés" : "Switch to Spanish"}
    >
      <img 
        src={lang === "es" ? "https://flagcdn.com/w40/es.png" : "https://flagcdn.com/w40/gb.png"} 
        alt={lang === "es" ? "Español" : "English"}
        style={{
          width: "24px",
          height: "auto",
          borderRadius: "2px",
          objectFit: "cover"
        }}
      />
    </button>
  );
}
