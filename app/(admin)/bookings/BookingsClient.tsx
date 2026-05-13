"use client";

import { useMemo, useState } from "react";
import type {
  Booking,
  BookingStatus,
  CreateBookingDto,
  UpdateBookingDto,
} from "@/lib/api";
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

function StatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useLanguage();
  const label =
    status === "pending"
      ? t("status.pending")
      : status === "confirmed"
        ? t("status.confirmed")
        : t("status.paid_fem");

  return <span className={`badge badge--${status}`}>{label}</span>;
}

function formatDate(date: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function BookingsClient({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const { t, lang } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const emptyForm: CreateBookingDto = {
    date: "",
    time: "",
    status: "pending",
    customerId: 1,
    businessId: 1,
    serviceName: "",
  };

  const [createForm, setCreateForm] = useState<CreateBookingDto>(emptyForm);
  const [editForm, setEditForm] = useState<CreateBookingDto>(emptyForm);

  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const paidCount = bookings.filter((b) => b.status === "paid").length;

  function updateCreateForm<K extends keyof CreateBookingDto>(
    key: K,
    value: CreateBookingDto[K]
  ) {
    setCreateForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateEditForm<K extends keyof CreateBookingDto>(
    key: K,
    value: CreateBookingDto[K]
  ) {
    setEditForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetCreateForm() {
    setCreateForm(emptyForm);
  }

  function resetEditForm() {
    setEditForm(emptyForm);
  }

  function openCreateForm() {
    setErrorMessage("");
    setSuccessMessage("");
    setEditingBookingId(null);
    setDeleteTargetId(null);
    resetEditForm();
    setIsCreateOpen(true);
  }

  function closeCreateForm() {
    setErrorMessage("");
    resetCreateForm();
    setIsCreateOpen(false);
  }

  function openEditForm(booking: Booking) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCreateOpen(false);
    setDeleteTargetId(null);
    setEditingBookingId(booking.id);
    setEditForm({
      date: booking.date,
      time: booking.time,
      status: booking.status,
      customerId: booking.customerId,
      businessId: booking.businessId,
      serviceName: booking.serviceName,
    });
  }

  function closeEditForm() {
    setErrorMessage("");
    setEditingBookingId(null);
    resetEditForm();
  }

  function openDeleteModal(id: number) {
    setErrorMessage("");
    setSuccessMessage("");
    setDeleteTargetId(id);
  }

  function closeDeleteModal() {
    setDeleteTargetId(null);
  }

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingCreate(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const created = await createAppointment(createForm);
      setBookings((prev) => [created, ...prev]);
      resetCreateForm();
      setIsCreateOpen(false);
      setSuccessMessage(t("bookings.form.success.create"));
    } catch {
      setErrorMessage(t("bookings.form.error.create"));
    } finally {
      setLoadingCreate(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingBookingId) return;

    setLoadingEdit(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload: UpdateBookingDto = {
        date: editForm.date,
        time: editForm.time,
        status: editForm.status,
        customerId: editForm.customerId,
        businessId: editForm.businessId,
        serviceName: editForm.serviceName,
      };

      const updated = await updateAppointment(editingBookingId, payload);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === editingBookingId ? updated : booking
        )
      );

      setEditingBookingId(null);
      resetEditForm();
      setSuccessMessage(t("bookings.form.success.update"));
    } catch {
      setErrorMessage(t("bookings.form.error.update"));
    } finally {
      setLoadingEdit(false);
    }
  }

  async function confirmDelete() {
    if (deleteTargetId === null) return;

    setDeletingBookingId(deleteTargetId);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await deleteAppointment(deleteTargetId);
      setBookings((prev) => prev.filter((booking) => booking.id !== deleteTargetId));

      if (editingBookingId === deleteTargetId) {
        closeEditForm();
      }

      setSuccessMessage(t("bookings.form.success.delete"));
      closeDeleteModal();
    } catch {
      setErrorMessage(t("bookings.form.error.delete"));
    } finally {
      setDeletingBookingId(null);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>{t("bookings.title")}</h2>
          <p>{t("bookings.subtitle")}</p>
        </div>

        <button className="primary-btn" type="button" onClick={openCreateForm}>
          {t("bookings.new")}
        </button>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-card__label">{t("bookings.total")}</p>
          <h3 className="kpi-card__value">{totalCount}</h3>
          <p className="kpi-card__meta">{t("bookings.total.meta")}</p>
        </div>

        <div className="kpi-card">
          <p className="kpi-card__label">{t("status.pending")}</p>
          <h3 className="kpi-card__value">{pendingCount}</h3>
          <p className="kpi-card__meta kpi-card__meta--warning">
            {t("bookings.pending.meta")}
          </p>
        </div>

        <div className="kpi-card">
          <p className="kpi-card__label">{t("status.confirmed")}</p>
          <h3 className="kpi-card__value">{confirmedCount}</h3>
          <p className="kpi-card__meta kpi-card__meta--positive">
            {t("bookings.confirmed.meta")}
          </p>
        </div>

        <div className="kpi-card">
          <p className="kpi-card__label">{t("status.paid_fem")}</p>
          <h3 className="kpi-card__value">{paidCount}</h3>
          <p className="kpi-card__meta">{t("bookings.paid.meta")}</p>
        </div>
      </section>

      {isCreateOpen && (
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">{t("bookings.form.title")}</h3>
            <button type="button" className="secondary-btn" onClick={closeCreateForm}>
              {t("customers.form.cancel")}
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="page-stack" style={{ gap: 16 }}>
            <div className="form-grid">
              <input
                className="input"
                type="date"
                value={createForm.date}
                onChange={(e) => updateCreateForm("date", e.target.value)}
                required
              />
              <input
                className="input"
                type="time"
                value={createForm.time}
                onChange={(e) => updateCreateForm("time", e.target.value)}
                required
              />
              <select
                className="select"
                value={createForm.status}
                onChange={(e) =>
                  updateCreateForm("status", e.target.value as BookingStatus)
                }
              >
                <option value="pending">{t("status.pending")}</option>
                <option value="confirmed">{t("status.confirmed")}</option>
                <option value="paid">{t("status.paid_fem")}</option>
              </select>
              <input
                className="input"
                type="number"
                min={1}
                value={createForm.customerId}
                onChange={(e) =>
                  updateCreateForm("customerId", Number(e.target.value))
                }
                placeholder="Customer ID"
                required
              />
              <input
                className="input"
                type="number"
                min={1}
                value={createForm.businessId}
                onChange={(e) =>
                  updateCreateForm("businessId", Number(e.target.value))
                }
                placeholder="Business ID"
                required
              />
              <input
                className="input input--full"
                type="text"
                value={createForm.serviceName}
                onChange={(e) => updateCreateForm("serviceName", e.target.value)}
                placeholder={t("table.service")}
                required
              />
            </div>

            {errorMessage ? <div className="message-error">{errorMessage}</div> : null}

            <div className="message-row">
              <button className="primary-btn" type="submit" disabled={loadingCreate}>
                {loadingCreate ? t("customers.form.saving") : t("bookings.form.create")}
              </button>
            </div>
          </form>
        </section>
      )}

      {editingBookingId !== null && (
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">{t("bookings.form.edit")} #{editingBookingId}</h3>
            <button type="button" className="secondary-btn" onClick={closeEditForm}>
              {t("customers.form.cancel")}
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="page-stack" style={{ gap: 16 }}>
            <div className="form-grid">
              <input
                className="input"
                type="date"
                value={editForm.date}
                onChange={(e) => updateEditForm("date", e.target.value)}
                required
              />
              <input
                className="input"
                type="time"
                value={editForm.time}
                onChange={(e) => updateEditForm("time", e.target.value)}
                required
              />
              <select
                className="select"
                value={editForm.status}
                onChange={(e) =>
                  updateEditForm("status", e.target.value as BookingStatus)
                }
              >
                <option value="pending">{t("status.pending")}</option>
                <option value="confirmed">{t("status.confirmed")}</option>
                <option value="paid">{t("status.paid_fem")}</option>
              </select>
              <input
                className="input"
                type="number"
                min={1}
                value={editForm.customerId}
                onChange={(e) =>
                  updateEditForm("customerId", Number(e.target.value))
                }
                placeholder="Customer ID"
                required
              />
              <input
                className="input"
                type="number"
                min={1}
                value={editForm.businessId}
                onChange={(e) =>
                  updateEditForm("businessId", Number(e.target.value))
                }
                placeholder="Business ID"
                required
              />
              <input
                className="input input--full"
                type="text"
                value={editForm.serviceName}
                onChange={(e) => updateEditForm("serviceName", e.target.value)}
                placeholder={t("table.service")}
                required
              />
            </div>

            {errorMessage ? <div className="message-error">{errorMessage}</div> : null}

            <div className="message-row">
              <button className="primary-btn" type="submit" disabled={loadingEdit}>
                {loadingEdit ? t("customers.form.saving") : t("bookings.form.save")}
              </button>
            </div>
          </form>
        </section>
      )}

      {deleteTargetId !== null && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="modal-card">
            <div className="modal-icon">!</div>
            <h3 id="delete-modal-title" className="modal-title">
              {t("bookings.delete.title")}
            </h3>
            <p id="delete-modal-description" className="modal-text">
              {t("bookings.delete.text")}{deleteTargetId}? {t("bookings.delete.confirm")}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeDeleteModal}
              >
                {t("customers.form.cancel")}
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={confirmDelete}
                disabled={deletingBookingId === deleteTargetId}
              >
                {deletingBookingId === deleteTargetId ? t("bookings.delete.deleting") : t("bookings.delete.action")}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">{t("bookings.list.title")}</h3>
          <div className="filter-row">
            <button type="button" className="filter-pill" onClick={() => setStatusFilter("all")}>{t("bookings.filter.all")}</button>
            <button type="button" className="filter-pill" onClick={() => setStatusFilter("pending")}>{t("status.pending")}</button>
            <button type="button" className="filter-pill" onClick={() => setStatusFilter("confirmed")}>{t("status.confirmed")}</button>
            <button type="button" className="filter-pill" onClick={() => setStatusFilter("paid")}>{t("status.paid_fem")}</button>
          </div>
        </div>

        {successMessage ? <div className="message-success" style={{ marginBottom: 12 }}>{successMessage}</div> : null}
        {errorMessage ? <div className="message-error" style={{ marginBottom: 12 }}>{errorMessage}</div> : null}

        <table className="data-table">
          <thead>
            <tr>
              <th>{t("table.id")}</th>
              <th>{t("table.date")}</th>
              <th>{t("table.time")}</th>
              <th>{t("table.service")}</th>
              <th>{t("table.customer")}</th>
              <th>{t("table.business")}</th>
              <th>{t("table.status")}</th>
              <th>{t("table.action")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td style={{ fontWeight: 600 }}>{booking.id}</td>
                <td>{formatDate(booking.date, lang)}</td>
                <td>{booking.time}</td>
                <td>{booking.serviceName}</td>
                <td>{booking.customerId}</td>
                <td>{booking.businessId}</td>
                <td><StatusBadge status={booking.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className="secondary-btn" onClick={() => openEditForm(booking)}>
                      {t("table.action")}
                    </button>
                    <button type="button" className="secondary-btn" onClick={() => openDeleteModal(booking.id)}>
                      {t("bookings.delete.action")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}