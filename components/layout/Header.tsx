"use client";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

type CurrentUser = {
  name?: string;
  lastName?: string;
  email?: string;
};

function computeInitials(user: CurrentUser | null): string {
  const firstName = (user?.name ?? "").trim();
  const lastName = (user?.lastName ?? "").trim();

  const firstParts = firstName.split(/\s+/).filter(Boolean);
  const lastParts = lastName.split(/\s+/).filter(Boolean);

  const firstInitial = (firstParts[0]?.[0] ?? "").toUpperCase();
  let secondInitial = (lastParts[0]?.[0] ?? "").toUpperCase();

  if (!secondInitial) secondInitial = (firstParts[1]?.[0] ?? "").toUpperCase();
  if (!secondInitial) secondInitial = (firstParts[0]?.[1] ?? "").toUpperCase();

  const result = `${firstInitial}${secondInitial}`.trim();
  return (result.length >= 2 ? result.slice(0, 2) : (result + "??").slice(0, 2));
}

export default function Header() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  
const handleLogout = () => {
  setIsMenuOpen(false);
  // Limpia TODOS los datos de sesión/caché para evitar acceso no autorizado
  localStorage.clear();
  sessionStorage.clear();
  // Reemplaza todo el historial para que el botón atrás no funcione
  window.location.replace("/login");
};

  const handleViewProfile = () => {
    setIsMenuOpen(false);
    router.push("/profile");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (!raw) {
        setCurrentUser(null);
        return;
      }
      setCurrentUser(JSON.parse(raw));
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const avatarText = computeInitials(currentUser);
  const avatarTitle = currentUser?.name
    ? `${currentUser.name}${currentUser.lastName ? ` ${currentUser.lastName}` : ""}`
    : t("header.profile_menu");

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
        
        <div className="profile-menu-container" ref={menuRef}>
          <div 
            className="admin-avatar" 
            onClick={toggleMenu}
            style={{ cursor: 'pointer' }}
            title={avatarTitle}
          >
            {avatarText}
          </div>

          {isMenuOpen && (
            <div className="profile-dropdown surface-card">
              <button className="dropdown-item" onClick={handleViewProfile}>
                <i className="bi bi-person"></i>
                {t("header.view_profile")}
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                {t("header.logout")}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-menu-container {
          position: relative;
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 180px;
          padding: 8px;
          z-index: 100;
          box-shadow: var(--shadow-md);
          animation: fadeIn 0.2s ease-out;
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          background: transparent;
          color: var(--text);
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--primary-soft);
          color: var(--accent);
          transform: translateX(4px);
        }
        [data-theme='dark'] .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--accent);
          box-shadow: 0 0 10px rgba(96, 165, 250, 0.2);
        }
        .dropdown-item:active {
          transform: scale(0.98);
        }
        .dropdown-item i {
          font-size: 16px;
          color: var(--muted);
        }
        .dropdown-item.logout {
          color: #dc2626;
        }
        .dropdown-item.logout i {
          color: #dc2626;
        }
        .dropdown-item.logout:hover {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          box-shadow: none;
        }
        [data-theme='dark'] .dropdown-item.logout:hover {
          background: rgba(220, 38, 38, 0.15);
          color: #ef4444;
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.15);
        }
        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 4px 8px;
        }
      `}</style>
    </header>
  );
}