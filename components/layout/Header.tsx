import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="admin-header">
      <div>
        <h1 className="admin-header__title">Bookings Admin</h1>
        <p className="admin-header__subtitle">
          Plataforma de gestión de reservas y cobros
        </p>
      </div>
      <div className="admin-header__actions">
        <ThemeToggle />
        <div className="admin-avatar">AD</div>
      </div>
    </header>
  );
}