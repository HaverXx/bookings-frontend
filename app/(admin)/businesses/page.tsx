"use client";

import { useEffect, useState } from "react";
import { createBusiness, getBusinesses, deleteBusiness, updateBusiness } from "@/lib/api";
import type { Business } from "@/lib/types";
import type { CreateBusinessDto, UpdateBusinessDto } from "@/lib/api";
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

function EditBusinessModal({
  business,
  onSaved,
  onClose,
}: {
  business: Business;
  onSaved: (b: Business) => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<CreateBusinessDto>({ name: business.name });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError(t("businesses.form.error.required"));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: UpdateBusinessDto = { name: form.name.trim() };
      const updated = await updateBusiness(business.businessID, payload);
      onSaved(updated);
      onClose();
    } catch {
      setError(t("businesses.edit.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">{t("businesses.edit.title")}</p>
        <p className="modal-text">{t("businesses.edit.text")}</p>

        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>ID</label>
            <div className="customer-tag">#{business.businessID}</div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>{t("businesses.form.name")}</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Peluquería Nova"
            />
          </div>
        </div>

        {error && <p className="message-error" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            {t("businesses.form.cancel")}
          </button>
          <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? t("businesses.edit.saving") : t("businesses.edit.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function BusinessCard({
  business,
  onDelete,
  onUpdated,
}: {
  business: Business;
  onDelete: (id: number) => void;
  onUpdated: (business: Business) => void;
}) {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  async function handleDelete() {
    if (!confirm(t("businesses.delete.text"))) return;
    setDeleting(true);
    try {
      await deleteBusiness(business.businessID);
      onDelete(business.businessID);
    } catch {
      alert(t("businesses.delete.error"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {showEdit && (
        <EditBusinessModal
          business={business}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => onUpdated(updated)}
        />
      )}
      <div className="customer-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <p className="customer-name">#{business.businessID} · {business.name}</p>
        </div>
        <p className="customer-meta">ID: {business.businessID}</p>
        <div className="customer-tag">{t("nav.businesses")}</div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            className="secondary-btn btn-edit"
            style={{ flex: 1 }}
            onClick={() => setShowEdit(true)}
          >
            {t("businesses.edit.action")}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="danger-btn"
            style={{ flex: 1 }}
          >
            {deleting ? t("businesses.delete.deleting") : t("businesses.delete.action")}
          </button>
        </div>
      </div>
    </>
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
                onUpdated={(updated) => setBusinesses((prev) => prev.map((b) => b.businessID === updated.businessID ? updated : b))}
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}
