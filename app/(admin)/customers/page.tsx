"use client";

import { useEffect, useState } from "react";
import { createCustomer, getCustomers } from "@/lib/api";
import type { Customer } from "@/lib/types";
import type { CreateCustomerDto } from "@/lib/api";

const EMPTY_FORM: CreateCustomerDto = {
  name: "",
  phone: "",
  email: "",
  business: "",
};

function NewCustomerModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (c: Customer) => void;
}) {
  const [form, setForm] = useState<CreateCustomerDto>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.email || !form.business) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const created = await createCustomer(form);
      onCreated(created);
      onClose();
    } catch {
      setError("Error al crear el cliente. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">Nuevo cliente</p>
        <p className="modal-text">Rellena los datos para añadir un cliente al directorio.</p>

        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              Nombre
            </label>
            <input
              className="input"
              name="name"
              placeholder="María López"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              Teléfono
            </label>
            <input
              className="input"
              name="phone"
              placeholder="600 123 456"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              className="input"
              name="email"
              type="email"
              placeholder="maria@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              Negocio
            </label>
            <input
              className="input"
              name="business"
              placeholder="Peluquería Nova"
              value={form.business}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="message-error" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando…" : "Crear cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="customer-card">
      <p className="customer-name">{customer.name}</p>
      <p className="customer-meta">{customer.phone}</p>
      <p className="customer-meta">{customer.email}</p>
      <div className="customer-tag">{customer.business}</div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => setError("No se pudieron cargar los clientes."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    [c.name, c.email, c.phone, c.business]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      {showModal && (
        <NewCustomerModal
          onClose={() => setShowModal(false)}
          onCreated={(c) => setCustomers((prev) => [...prev, c])}
        />
      )}

      <div className="page-stack">
        <section className="page-hero">
          <div>
            <h2>Customer directory</h2>
            <p>Gestión visual de clientes y próximas reservas.</p>
          </div>
          <button className="primary-btn" type="button" onClick={() => setShowModal(true)}>
            Nuevo cliente
          </button>
        </section>

        <section className="section-card">
          <div className="search-row">
            <input
              className="input"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {loading && <p style={{ color: "var(--muted)", textAlign: "center" }}>Cargando clientes…</p>}
        {error && <p className="message-error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: "var(--muted)", textAlign: "center" }}>No se encontraron clientes.</p>
        )}

        {!loading && (
          <section className="customer-grid">
            {filtered.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </section>
        )}
      </div>
    </>
  );
}