"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:3000";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, lastName, birthDate, email, password } = formData;

    if (!name || !lastName || !birthDate || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!email.toLowerCase().endsWith("@admin.com")) {
      setError("Solo se permiten correos de dominio @admin.com");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastName, birthDate, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al crear la cuenta.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="surface-card auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Regístrate para empezar a gestionar</p>
        </div>

        {success ? (
          <div className="success-message">
            <i className="bi bi-check-circle-fill"></i>
            <p>¡Cuenta creada con éxito! Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input id="name" type="text" className="input" placeholder="Tu nombre" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellidos</label>
                <input id="lastName" type="text" className="input" placeholder="Tus apellidos" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Fecha de Nacimiento</label>
              <input id="birthDate" type="date" className="input" value={formData.birthDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico (@admin.com)</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input id="email" type="email" className="input" placeholder="usuario@admin.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña (min. 8 caracteres)</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input id="password" type="password" className="input" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            {error && <p className="message-error">{error}</p>}

            <button type="submit" className="primary-btn auth-submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>¿Ya tienes una cuenta? <Link href="/login" className="panel-subtle-link">Inicia sesión</Link></p>
        </div>
      </div>

      <style jsx>{`
        .auth-container { display: grid; place-items: center; min-height: 100vh; padding: 20px; }
        .auth-card { width: min(100%, 480px); padding: 40px; animation: slideIn 0.5s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-title { font-size: 32px; font-weight: 800; letter-spacing: -0.04em; margin: 0; }
        .auth-subtitle { color: var(--muted); margin-top: 8px; font-size: 15px; }
        .auth-form { display: flex; flex-direction: column; gap: 18px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: var(--text); }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper i { position: absolute; left: 14px; color: var(--muted); font-size: 18px; }
        .input-wrapper .input { padding-left: 44px; }
        .auth-submit { width: 100%; padding: 14px; font-size: 16px; margin-top: 8px; }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 24px; font-size: 14px; color: var(--muted); }
        .success-message { text-align: center; padding: 20px; background: var(--success-bg); color: var(--success-text); border-radius: 14px; margin-bottom: 20px; }
        .success-message i { font-size: 40px; display: block; margin-bottom: 12px; }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
