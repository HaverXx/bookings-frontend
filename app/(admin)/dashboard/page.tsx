"use client";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getAppointments, type Booking } from "@/lib/api";
import { ExportButton } from "./ExportButton";

type DashboardBookingStatus = "pending" | "confirmed" | "paid";

type DashboardBooking = {
  time: string;
  client: string;
  business: string;
  service: string;
  status: DashboardBookingStatus;
};

function Badge({ status }: { status: DashboardBookingStatus }) {
  const { t } = useLanguage();
  const label =
    status === "pending"
      ? t("status.pending")
      : status === "confirmed"
        ? t("status.confirmed")
        : t("status.paid_fem");

  return <span className={`badge badge--${status}`}>{label}</span>;
}

function KpiCard({
  title,
  value,
  subtitle,
  variant,
}: {
  title: string;
  value: string;
  subtitle: string;
  variant?: "positive" | "warning";
}) {
  return (
    <div className="kpi-card">
      <p className="kpi-card__label">{title}</p>
      <h3 className="kpi-card__value">{value}</h3>
      <p
        className={`kpi-card__meta ${
          variant === "positive"
            ? "kpi-card__meta--positive"
            : variant === "warning"
              ? "kpi-card__meta--warning"
              : ""
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Booking[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error cargando reservas", error);
      }
    };

    void loadAppointments();
  }, []);

  const bookings = useMemo<DashboardBooking[]>(() => {
    const today = new Date().toISOString().split("T")[0];

    return appointments
      .filter((appointment) => appointment.date === today && !appointment.serviceName.includes("Cobro"))
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((appointment) => ({
        time: appointment.time,
        client: `Cliente #${appointment.customerId}`,
        business: `Comercio #${appointment.businessId}`,
        service: appointment.serviceName,
        status: appointment.status,
      }));
  }, [appointments]);

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const todayAppointments = appointments.filter((a) => a.date === today);
  const yesterdayAppointments = appointments.filter((a) => a.date === yesterday);

  const paidCount = todayAppointments.filter((a) => a.status === "paid").length;
  const pendingCount = todayAppointments.filter((a) => a.status === "pending").length;
  const activeCustomers = new Set(appointments.map((item) => item.customerId)).size;

  function parseAmountFromService(serviceName: string): number {
    const match = (serviceName || "").match(/(\d+(?:\.\d+)?)/);
    if (!match) return 0;
    const n = Number(match[0]);
    return Number.isFinite(n) ? n : 0;
  }

  const totalPaidAmount = todayAppointments
    .filter((a) => a.status === "paid")
    .reduce((sum, a) => sum + parseAmountFromService(a.serviceName), 0);

  const kpis = [
    {
      title: t("dashboard.kpi.bookings"),
      value: String(bookings.length),
      subtitle: (() => {
        const diff = bookings.length - yesterdayAppointments.length;
        return `${diff >= 0 ? "+" : ""}${diff} respecto a ayer`;
      })(),
      variant: "positive" as const,
    },
    {
      title: t("dashboard.kpi.revenue"),
      value: `${totalPaidAmount} €`,
      subtitle: `${paidCount} ${paidCount === 1 ? "pago registrado" : "pagos registrados"}`,
    },
    {
      title: t("dashboard.kpi.pending"),
      value: String(pendingCount),
      subtitle: t("dashboard.kpi.pending.meta"),
      variant: pendingCount > 0 ? ("warning" as const) : undefined,
    },
    {
      title: t("dashboard.kpi.customers"),
      value: String(activeCustomers),
      subtitle: t("dashboard.kpi.customers.meta"),
    },
  ];

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>{t("dashboard.title")}</h2>
          <p>{t("dashboard.subtitle")}</p>
        </div>

        <ExportButton
          bookings={bookings}
          kpis={kpis.map(({ title, value, subtitle }) => ({ title, value, subtitle }))}
        />
      </section>

      <section className="kpi-grid">
        <KpiCard
          title={kpis[0].title}
          value={kpis[0].value}
          subtitle={kpis[0].subtitle}
          variant={kpis[0].variant}
        />
        <KpiCard 
          title={kpis[1].title} 
          value={kpis[1].value} 
          subtitle={kpis[1].subtitle} 
        />
        <KpiCard
          title={kpis[2].title}
          value={kpis[2].value}
          subtitle={kpis[2].subtitle}
          variant={kpis[2].variant}
        />
        <KpiCard 
          title={kpis[3].title} 
          value={kpis[3].value} 
          subtitle={kpis[3].subtitle} 
        />
      </section>

      <section className="dashboard-grid">
        <div className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">{t("dashboard.next")}</h3>
            <button className="panel-subtle-link" type="button">
              {t("dashboard.viewAll")}
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>{t("table.time")}</th>
                <th>{t("table.customer")}</th>
                <th>{t("table.business")}</th>
                <th>{t("table.service")}</th>
                <th>{t("table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{booking.time}</td>
                  <td>{booking.client}</td>
                  <td>{booking.business}</td>
                  <td>{booking.service}</td>
                  <td>
                    <Badge status={booking.status} />
                  </td>
                </tr>
              ))}
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>
                    No hay reservas para hoy
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="info-stack">
          <div className="info-box">
            <p className="info-box__eyebrow">{t("dashboard.info.next")}</p>
            <p className="info-box__title">
              {bookings[0]?.client ?? "Sin reservas"}
            </p>
            <p className="info-box__text">
              {bookings[0] ? `${bookings[0].time} · ${bookings[0].business}` : "No hay reservas para hoy"}
            </p>
          </div>

          <div className="info-box">
            <p className="info-box__eyebrow">{t("dashboard.info.featured")}</p>
            <p className="info-box__title">{bookings.length}</p>
            <p className="info-box__text">Reservas hoy</p>
          </div>

          <div className="info-box">
            <p className="info-box__eyebrow">{t("dashboard.info.reminders")}</p>
            <p className="info-box__title">{pendingCount} pendientes</p>
            <p className="info-box__text">{t("dashboard.info.reminders.text")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}