"use client";
import { useState } from "react";

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
  const isPaid = status === "Pagado";
  return (
    <span className={`badge ${isPaid ? "badge--confirmed" : "badge--pending"}`}>
      {status}
    </span>
  );
}

export default function PaymentsPage() {
  // Datos iniciales basados en tu archivo .sqlite [cite: 74]
  const [paymentList, setPaymentList] = useState<Payment[]>([
    { idPago: 1, Cliente: "Juan García", Comercio: "Masaje", Importe: 40.00, Metodo: "Efectivo", fecha: "2024-04-23", estado: "Pendiente" },
    { idPago: 2, Cliente: "Ana Pi", Comercio: "Habitacion Hotel", Importe: 120.00, Metodo: "Tarjeta", fecha: "2007-10-05", estado: "Pagado" }
  ]);

  // Función para registrar el cobro (Simula la inserción en la tabla 'pagos') 
  const handleRegisterPayment = () => {
    const nuevoImporte = prompt("Introduce el importe del cobro:");
    const nuevoCliente = prompt("Introduce el nombre del cliente:");

    if (nuevoImporte && nuevoCliente) {
      const newEntry: Payment = {
        idPago: paymentList.length + 1,
        Cliente: nuevoCliente,
        Comercio: "Comercio General",
        Importe: parseFloat(nuevoImporte),
        Metodo: "Efectivo",
        fecha: new Date().toISOString().split('T')[0],
        estado: "Pagado",
      };

      setPaymentList([newEntry, ...paymentList]);
      alert("Cobro registrado con éxito.");
    }
  };

  // Función de Impresión: Genera una ventana con el formato de recibo
  const handlePrint = (payment: Payment) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Recibo de Cobro - ${payment.idPago}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="border: 1px solid #000; padding: 20px; max-width: 400px;">
              <h2 style="text-align: center;">RECIBO DE PAGO</h2>
              <hr>
              <p><strong>ID Pago:</strong> ${payment.idPago}</p>
              <p><strong>Cliente:</strong> ${payment.Cliente}</p>
              <p><strong>Comercio:</strong> ${payment.Comercio}</p>
              <p><strong>Importe:</strong> ${payment.Importe} €</p>
              <p><strong>Método:</strong> ${payment.Metodo}</p>
              <p><strong>Fecha:</strong> ${payment.fecha}</p>
              <p><strong>Estado:</strong> ${payment.estado}</p>
              <hr>
              <p style="text-align: center;">Gracias por su compra</p>
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
          <h2>Pagos y Cobros</h2>
          <p>Gestión de ingresos para el comercio.</p>
        </div>

        <button
          className="primary-btn"
          type="button"
          onClick={handleRegisterPayment}
        >
          Registrar cobro
        </button>
      </section>

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Listado de Cobros Registrados</h3>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Importe</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th className="no-print">Acción</th>
            </tr>
          </thead>
          <tbody>
            {paymentList.map((p) => (
              <tr key={p.idPago}>
                <td>{p.idPago}</td>
                <td>{p.Cliente}</td>
                <td>{p.Importe} €</td>
                <td>{p.fecha}</td>
                <td><Badge status={p.estado} /></td>
                <td className="no-print">
                  <button
                    onClick={() => handlePrint(p)}
                    style={{ background: '#e5e7eb', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    🖨️ Imprimir
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