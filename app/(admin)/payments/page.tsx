"use client";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { createAppointment, getAppointments, type Booking } from "@/lib/api";

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

export default function PaymentsPage() {
  const { t } = useLanguage();

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAppointments();
        setBookings(data);
      } catch (error) {
        console.error('Error cargando cobros', error);
      }
    };
    void load();
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

  const handleRegisterPayment = async () => {
    const nuevoImporte = prompt(t('payments.prompt.amount'));
    const nuevoCliente = prompt(t('payments.prompt.customer'));

    if (!nuevoImporte || !nuevoCliente) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toTimeString().slice(0, 5);

      await createAppointment({
        date: today,
        time: nowTime,
        status: 'paid',
        customerId: 1,
        businessId: 1,
        serviceName: `Cobro ${parseFloat(nuevoImporte).toFixed(2)} EUR - ${nuevoCliente}`,
      });

      const data = await getAppointments();
      setBookings(data);
      alert(t('payments.alert.success'));
    } catch (error) {
      console.error('Error registrando cobro', error);
      alert('No se pudo registrar el cobro en la base de datos');
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
                  <button
                    onClick={() => handlePrint(p)}
                    style={{ background: '#e5e7eb', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    🖨️ {t("action.print")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}