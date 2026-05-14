"use client";

import { useEffect, useState } from "react";
import { createCustomer, deleteCustomer, getCustomers } from "@/lib/api";
import type { Customer } from "@/lib/types";
import type { CreateCustomerDto } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  const [form, setForm] = useState<CreateCustomerDto>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.email || !form.business) {
      setError(t("customers.form.error.required"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const created = await createCustomer(form);
      onCreated(created);
      onClose();
    } catch {
      setError(t("customers.form.error.create"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">{t("customers.modal.title")}</p>
        <p className="modal-text">{t("customers.modal.text")}</p>

        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {t("customers.form.name")}
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
              {t("customers.form.phone")}
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
              {t("customers.form.email")}
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
              {t("customers.form.business")}
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
            {t("customers.form.cancel")}
          </button>
          <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? t("customers.form.saving") : t("customers.form.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerDetailsModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">{t("customers.view.title")}</p>
        <p className="modal-text">{t("customers.view.text")}</p>

        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>ID</label>
            <div className="customer-tag">#{customer.id}</div>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>{t("customers.form.name")}</label>
            <div className="customer-tag">{customer.name}</div>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>{t("customers.form.phone")}</label>
            <div className="customer-tag">{customer.phone}</div>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>{t("customers.form.email")}</label>
            <div className="customer-tag">{customer.email}</div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>{t("customers.form.business")}</label>
            <div className="customer-tag">{customer.business}</div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            {t("customers.form.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerCard({
  customer,
  onDeleted,
}: {
  customer: Customer;
  onDeleted: (id: number) => void;
}) {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function handleDelete() {
    if (!confirm(t("customers.delete.text"))) return;

    setDeleting(true);
    try {
      await deleteCustomer(customer.id);
      onDeleted(customer.id);
    } catch {
      alert(t("customers.delete.error"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {showDetails && (
        <CustomerDetailsModal customer={customer} onClose={() => setShowDetails(false)} />
      )}
      <div className="customer-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <p className="customer-name">#{customer.id} · {customer.name}</p>
        </div>
        <p className="customer-meta">{customer.phone}</p>
        <p className="customer-meta">{customer.email}</p>
        <div className="customer-tag">{customer.business}</div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            className="secondary-btn btn-edit"
            style={{ flex: 1 }}
            onClick={() => setShowDetails(true)}
          >
            {t("customers.view.action")}
          </button>
          <button
            className="danger-btn"
            style={{ flex: 1 }}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? t("customers.delete.deleting") : t("customers.delete.action")}
          </button>
        </div>
      </div>
    </>
  );
}

export default function CustomersPage() {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => setError(t("customers.error.load")))
      .finally(() => setLoading(false));
  }, [t]);

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
            <h2>{t("customers.title")}</h2>
            <p>{t("customers.subtitle")}</p>
          </div>
          <button className="primary-btn btn-primary-action" type="button" onClick={() => setShowModal(true)}>
            {t("customers.new")}
          </button>
        </section>

        <section className="section-card">
          <div className="search-row">
            <input
              className="input"
              placeholder={t("customers.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {loading && <p style={{ color: "var(--muted)", textAlign: "center" }}>{t("customers.loading")}</p>}
        {error && <p className="message-error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: "var(--muted)", textAlign: "center" }}>{t("customers.empty")}</p>
        )}

        {!loading && (
          <section className="customer-grid">
            {filtered.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onDeleted={(id) => setCustomers((prev) => prev.filter((c) => c.id !== id))}
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}