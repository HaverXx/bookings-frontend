"use client";
import { useLanguage } from "@/context/LanguageContext";
import { ExportButton } from "./ExportButton";

type DashboardBookingStatus = "pending" | "confirmed" | "paid";

type DashboardBooking = {
  time: string;
  client: string;
  business: string;
  service: string;
  status: DashboardBookingStatus;
};

const bookings: DashboardBooking[] = [
  {
    time: "09:00",
    client: "María López",
    business: "Peluquería Nova",
    service: "Corte + peinado",
    status: "confirmed",
  },
  {
    time: "10:30",
    client: "Carlos Pérez",
    business: "Restaurante Marea",
    service: "Reserva para 4",
    status: "pending",
  },
  {
    time: "12:00",
    client: "Lucía Sánchez",
    business: "Barber Studio",
    service: "Corte caballero",
    status: "paid",
  },
];

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

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>{t("dashboard.title")}</h2>
          <p>{t("dashboard.subtitle")}</p>
        </div>

        <button className="primary-btn" type="button">
          {t("dashboard.export")}
        </button>
      </section>

      <section className="kpi-grid">
        <KpiCard
          title={t("dashboard.kpi.bookings")}
          value="24"
          subtitle={t("dashboard.kpi.bookings.meta")}
          variant="positive"
        />
        <KpiCard 
          title={t("dashboard.kpi.revenue")} 
          value="820 €" 
          subtitle={t("dashboard.kpi.revenue.meta")} 
        />
        <KpiCard
          title={t("dashboard.kpi.pending")}
          value="6"
          subtitle={t("dashboard.kpi.pending.meta")}
          variant="warning"
        />
        <KpiCard 
          title={t("dashboard.kpi.customers")} 
          value="214" 
          subtitle={t("dashboard.kpi.customers.meta")} 
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
            </tbody>
          </table>
        </div>

        <div className="info-stack">
          <div className="info-box">
            <p className="info-box__eyebrow">{t("dashboard.info.next")}</p>
            <p className="info-box__title">María López</p>
            <p className="info-box__text">09:00 · Peluquería Nova</p>
          </div>

          <div className="info-box">
            <p className="info-box__eyebrow">{t("dashboard.info.featured")}</p>
            <p className="info-box__title">Restaurante Marea</p>
            <p className="info-box__text">{t("dashboard.info.featured.text")}</p>
          </div>

          <div className="info-box">
            <p className="info-box__eyebrow">{t("dashboard.info.reminders")}</p>
            <p className="info-box__title">{t("dashboard.info.reminders.title")}</p>
            <p className="info-box__text">{t("dashboard.info.reminders.text")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}