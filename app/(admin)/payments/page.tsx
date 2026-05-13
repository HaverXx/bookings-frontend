"use client";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { createAppointment, deleteAppointment, getAppointments, type Booking } from "@/lib/api";


// 1. Tipos alineados con la tabla 'pagos' de tu SQLite 
type PaymentStatus = "Pagado" | "Pendiente";

type Payment = {
  idPago: number;
  Cliente: string;
  Comercio: string;
  Importe: number;
  Metodo: string;
  fecha: string;
  estado: PaymentStatus;
};

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
  const isPaid = status === "Pagado";
  return (
    <span className={`badge ${isPaid ? "badge--confirmed" : "badge--pending"}`}>
      {status === "Pagado" ? t("status.paid") : t("status.pending")}
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const nowTime = new Date().toTimeString().slice(0, 5);

      // Creamos la "cita" que actúa como cobro
      await createAppointment({
        date: form.date,
        time: nowTime,
        status: 'paid',
        customerId: 1, // ID genérico para cobros directos
        businessId: 1,
        serviceName: `Cobro ${parseFloat(form.amount).toFixed(2)} EUR - ${form.customerName.trim()}`,
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

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Función para cargar los cobros desde el servidor
  const loadBookings = async () => {
    try {
      const data = await getAppointments();
      setBookings(data);
    } catch (error) {
      console.error('Error cargando cobros', error);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);


  function toPayment(booking: Booking): Payment {
    // Extraer nombre del cliente del serviceName (formato: "Cobro {amount} EUR - {nombreCliente}")
    const clientNameMatch = booking.serviceName.match(/EUR\s*-\s*(.+)/);
    const clientName = clientNameMatch ? clientNameMatch[1].trim() : `Cliente #${booking.customerId}`;

    return {
      idPago: booking.id,
      Cliente: clientName,
      Comercio: `Comercio #${booking.businessId}`,
      Importe: Number((booking.serviceName.match(/(\d+(?:\.\d+)?)/) || [0])[0]) || 0,
      Metodo: 'Efectivo',
      fecha: booking.date,
      estado: booking.status === 'paid' ? 'Pagado' : 'Pendiente',
    };
  }

  const paymentList = useMemo(() => bookings.filter((b) => b.status === 'paid').map(toPayment), [bookings]);

  const handleRegisterPayment = () => {
    setShowModal(true);
  };


  const handleDelete = async (id: number) => {
    if (!confirm(t('bookings.delete.text') + id + "?")) return;

    try {
      await deleteAppointment(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Error eliminando cobro', error);
      alert(t('bookings.form.error.delete'));
    }
  };

  // Función de Impresión: Genera una ventana con el formato de recibo

  const handlePrint = (payment: Payment) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const statusText = payment.estado === "Pagado" ? t("status.paid") : t("status.pending");

      printWindow.document.write(`
        <html>
          <head><title>${t("receipt.title")} - ${payment.idPago}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="border: 1px solid #000; padding: 20px; max-width: 400px;">
              <h2 style="text-align: center;">${t("receipt.title")}</h2>
              <hr>
              <p><strong>${t("receipt.id")}:</strong> ${payment.idPago}</p>
              <p><strong>${t("table.customer")}:</strong> ${payment.Cliente}</p>
              <p><strong>${t("table.business")}:</strong> ${payment.Comercio}</p>
              <p><strong>${t("table.amount")}:</strong> ${payment.Importe} ${t("receipt.currency")}</p>
              <p><strong>${t("receipt.method")}:</strong> ${payment.Metodo}</p>
              <p><strong>${t("table.date")}:</strong> ${payment.fecha}</p>
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
          onCreated={loadBookings}
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
            className="primary-btn"
            type="button"
            onClick={handleRegisterPayment}
          >
            {t("payments.register")}
          </button>
        </section>

        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">{t("payments.list")}</h3>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>{t("table.id")}</th>
                <th>{t("table.customer")}</th>
                <th>{t("table.amount")}</th>
                <th>{t("table.date")}</th>
                <th>{t("table.status")}</th>
                <th className="no-print">{t("table.action")}</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.map((p) => (
                <tr key={p.idPago}>
                  <td>{p.idPago}</td>
                  <td>{p.Cliente}</td>
                  <td>{p.Importe} {t("receipt.currency")}</td>
                  <td>{p.fecha}</td>
                  <td><Badge status={p.estado} /></td>
                  <td className="no-print">
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handlePrint(p)}
                        style={{ background: '#f3f4f6', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '500' }}
                      >
                        <i className="bi bi-printer-fill"></i> {t("action.print")}
                      </button>
                      <button
                        onClick={() => handleDelete(p.idPago)}
                        style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '500' }}
                      >
                        <i className="bi bi-trash-fill"></i> {t("bookings.delete.action")}
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}