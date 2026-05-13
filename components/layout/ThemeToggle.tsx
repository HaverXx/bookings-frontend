"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="secondary-btn"
      style={{
        width: "40px",
        height: "40px",
        padding: "0",
        display: "grid",
        placeItems: "center",
        fontSize: "20px",
        borderRadius: "12px",
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <i className="bi bi-brightness-high-fill"></i> : <i className="bi bi-moon-fill"></i>}
    </button>
  );
}
