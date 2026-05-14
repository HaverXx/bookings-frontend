"use client";

import { useEffect, useState } from "react";
import { createBusiness, getBusinesses, deleteBusiness } from "@/lib/api";
import type { Business } from "@/lib/types";
import type { CreateBusinessDto } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

const EMPTY_FORM: CreateBusinessDto = {
  name: "",
};

function NewBusinessModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (b: Business) => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<CreateBusinessDto>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name) {
      setError(t("businesses.form.error.required"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const created = await createBusiness(form);
      onCreated(created);
      onClose();
    } catch {
      setError(t("businesses.form.error.create"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">{t("businesses.modal.title")}</p>
        <p className="modal-text">{t("businesses.modal.text")}</p>

        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {t("businesses.form.name")}
            </label>
            <input
              className="input"
              name="name"
              placeholder="Peluquería Nova"
              value={form.name}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="message-error" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose} disabled={loading}>
            {t("businesses.form.cancel")}
          </button>
          <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? t("businesses.form.saving") : t("businesses.form.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

function BusinessCard({ business, onDelete }: { business: Business; onDelete: (id: number) => void }) {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(t("businesses.delete.text"))) return;
    setDeleting(true);
    try {
      await deleteBusiness(business.businessID);
      onDelete(business.businessID);
    } catch {
      alert("Error al eliminar el negocio");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="customer-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="customer-name">{business.name}</p>
        <button 
          onClick={handleDelete}
          disabled={deleting}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--error)', 
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          {deleting ? '...' : '✕'}
        </button>
      </div>
      <p className="customer-meta">ID: {business.businessID}</p>
    </div>
  );
}

export default function BusinessesPage() {
  const { t } = useLanguage();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBusinesses()
      .then(setBusinesses)
      .catch(() => setError(t("businesses.error.load")))
      .finally(() => setLoading(false));
  }, [t]);

  const filtered = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {showModal && (
        <NewBusinessModal
          onClose={() => setShowModal(false)}
          onCreated={(b) => setBusinesses((prev) => [...prev, b])}
        />
      )}

      <div className="page-stack">
        <section className="page-hero">
          <div>
            <h2>{t("businesses.title")}</h2>
            <p>{t("businesses.subtitle")}</p>
          </div>
          <button className="primary-btn btn-primary-action" type="button" onClick={() => setShowModal(true)}>
            {t("businesses.new")}
          </button>
        </section>

        <section className="section-card">
          <div className="search-row">
            <input
              className="input"
              placeholder={t("businesses.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {loading && <p style={{ color: "var(--muted)", textAlign: "center" }}>{t("businesses.loading")}</p>}
        {error && <p className="message-error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: "var(--muted)", textAlign: "center" }}>{t("businesses.empty")}</p>
        )}

        {!loading && (
          <section className="customer-grid">
            {filtered.map((business) => (
              <BusinessCard 
                key={business.businessID} 
                business={business} 
                onDelete={(id) => setBusinesses((prev) => prev.filter(b => b.businessID !== id))}
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}
