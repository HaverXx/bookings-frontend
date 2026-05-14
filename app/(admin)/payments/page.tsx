"use client";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { createPayment, deletePayment, getPayments } from "@/lib/api";
import type { Payment, PaymentStatus } from "@/lib/types";

// Componentes de apoyo
function KpiCard({ title, value, subtitle, variant }: any) {
  return (
    <div className="kpi-card">
      <p className="kpi-card__label">{title}</p>
      <h3 className="kpi-card__value">{value}</h3>
      <p className={`kpi-card__meta ${variant === "positive" ? "kpi-card__meta--positive" : variant === "warning" ? "kpi-card__meta--warning" : ""}`}>
        {subtitle}
      </p>
    </div>
  );
}

function Badge({ status }: { status: PaymentStatus }) {
  const { t } = useLanguage();
  const isPaid = status === "completed";
  return (
    <span className={`badge ${isPaid ? "badge--confirmed" : "badge--pending"}`}>
      {status === "completed" ? t("status.paid") : t("status.pending")}
    </span>
  );
}

/**
 * Componente Modal para registrar un nuevo cobro
 */
function RegisterPaymentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    customerName: "",
    date: new Date().toISOString().split('T')[0],
    paymentMethod: "Efectivo",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.amount || parseFloat(form.amount) <= 0) {
      alert("Por favor, introduce un importe válido.");
      return;
    }
    if (!form.customerName.trim()) {
      alert("Por favor, introduce el nombre del cliente.");
      return;
    }

    setLoading(true);
    try {
      // Registramos el pago directamente en la tabla 'payment'
      await createPayment({
        amount: parseFloat(form.amount),
        date: form.date,
        paymentMethod: form.paymentMethod,
        appointmentId: 1, // ID genérico o de cortesía si no hay cita previa
        customerId: 1,    // ID genérico para cobros directos
        status: "completed",
        customerName: form.customerName.trim(),
        notes: "Cobro directo registrado desde el panel de pagos"
      });

      onCreated();
      onClose();
    } catch (error) {
      console.error('Error al registrar cobro:', error);
      alert('Error: No se pudo conectar con el servidor para registrar el cobro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">{t("payments.register")}</p>
        <p className="modal-text">{t("payments.subtitle")}</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {t("table.customer")}
            </label>
            <input
              className="input"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              required
              autoFocus
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {t("table.amount")}
            </label>
            <input
              className="input"
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {t("table.date")}
            </label>
            <input
              className="input"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              Método de Pago
            </label>
            <select 
              className="input" 
              name="paymentMethod" 
              value={form.paymentMethod}
              onChange={handleChange as any}
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div className="modal-actions" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
              {t("customers.form.cancel")}
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? t("customers.form.saving") : t("payments.register")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PaymentsPage() {

  const { t } = useLanguage();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Función para cargar los cobros desde el servidor
  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error cargando cobros', error);
    }
  };

  useEffect(() => {
    void loadPayments();
  }, []);


  const handleDelete = async (id: number) => {
    if (!confirm(t('bookings.delete.text') + id + "?")) return;

    try {
      await deletePayment(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error eliminando cobro', error);
      alert(t('bookings.form.error.delete'));
    }
  };

  // Función de Impresión: Genera una ventana con el formato de recibo

  const handlePrint = (payment: Payment) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const statusText = payment.status === "completed" ? t("status.paid") : t("status.pending");

      printWindow.document.write(`
        <html>
          <head><title>${t("receipt.title")} - ${payment.id}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="border: 1px solid #000; padding: 20px; max-width: 400px;">
              <h2 style="text-align: center;">${t("receipt.title")}</h2>
              <hr>
              <p><strong>${t("receipt.id")}:</strong> ${payment.id}</p>
              <p><strong>${t("table.customer")}:</strong> ${payment.customerName || `Cliente #${payment.customerId}`}</p>
              <p><strong>${t("table.amount")}:</strong> ${payment.amount} ${t("receipt.currency")}</p>
              <p><strong>${t("receipt.method")}:</strong> ${payment.paymentMethod}</p>
              <p><strong>${t("table.date")}:</strong> ${payment.date}</p>
              <p><strong>${t("table.status")}:</strong> ${statusText}</p>
              <hr>
              <p style="text-align: center;">${t("receipt.thanks")}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      {showModal && (
        <RegisterPaymentModal
          onClose={() => setShowModal(false)}
          onCreated={loadPayments}
        />
      )}
      <div className="page-stack">

        <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

        <section className="page-hero no-print">
          <div>
            <h2>{t("payments.title")}</h2>
            <p>{t("payments.subtitle")}</p>
          </div>

          <button
            className="primary-btn btn-primary-action"
            type="button"
            onClick={() => setShowModal(true)}
          >
            {t("payments.register")}
          </button>
        </section>

        {payments.length === 0 && (
          <p style={{ color: "var(--muted)", textAlign: "center" }}>{t("customers.empty")}</p>
        )}

        <section className="customer-grid">
          {payments.map((p) => (
            <div key={p.id} className="customer-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p className="customer-name">#{p.id} · {p.customerName || `Cliente #${p.customerId}`}</p>
                <Badge status={p.status} />
              </div>
              <p className="customer-meta">{p.date}</p>
              <div className="customer-tag">{p.amount} {t("receipt.currency")} · {p.paymentMethod}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="secondary-btn btn-edit" style={{ flex: 1 }} onClick={() => handlePrint(p)}>{t("action.print")}</button>
                <button className="danger-btn" style={{ flex: 1 }} onClick={() => handleDelete(p.id)}>{t("bookings.delete.action")}</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};
