"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

const translations = {
  es: {
    "app.title": "Bookings Admin",
    "app.subtitle": "Plataforma de gestión de reservas y cobros",
    "app.brand": "BookFlow",
    "app.workspace": "Espacio de trabajo",

    "nav.dashboard": "Panel de Control",
    "nav.bookings": "Reservas",
    "nav.customers": "Clientes",
    "nav.payments": "Pagos",

    "header.welcome": "Bienvenido de nuevo",
    "header.avatar": "AD",

    "dashboard.title": "Resumen del Dashboard",
    "dashboard.subtitle": "Control diario de reservas, actividad y pagos.",
    "dashboard.export": "Exportar Datos",
    "dashboard.kpi.bookings": "Reservas hoy",
    "dashboard.kpi.bookings.meta": "+5 respecto a ayer",
    "dashboard.kpi.revenue": "Cobrado hoy",
    "dashboard.kpi.revenue.meta": "18 pagos registrados",
    "dashboard.kpi.pending": "Pendientes",
    "dashboard.kpi.pending.meta": "Seguimiento necesario",
    "dashboard.kpi.customers": "Clientes activos",
    "dashboard.kpi.customers.meta": "Este mes",

    "dashboard.next": "Próximas reservas",
    "dashboard.viewAll": "Ver todas",
    "dashboard.info.next": "Siguiente reserva",
    "dashboard.info.featured": "Comercio destacado",
    "dashboard.info.featured.text": "6 reservas hoy",
    "dashboard.info.reminders": "Recordatorios",
    "dashboard.info.reminders.title": "4 confirmaciones pendientes",
    "dashboard.info.reminders.text": "Revisión recomendada esta mañana",

    "payments.title": "Pagos y Cobros",
    "payments.subtitle": "Gestión de ingresos para el comercio.",
    "payments.register": "Registrar cobro",
    "payments.list": "Listado de Cobros Registrados",
    "payments.prompt.amount": "Introduce el importe del cobro:",
    "payments.prompt.customer": "Introduce el nombre del cliente:",
    "payments.alert.success": "Cobro registrado con éxito.",
    "payments.default_business": "Comercio General",

    "customers.title": "Directorio de Clientes",
    "customers.subtitle": "Gestión visual de clientes y próximas reservas.",
    "customers.new": "Nuevo cliente",
    "customers.search": "Buscar cliente...",
    "customers.loading": "Cargando clientes...",
    "customers.empty": "No se encontraron clientes.",
    "customers.error.load": "No se pudieron cargar los clientes.",
    "customers.modal.title": "Nuevo cliente",
    "customers.modal.text": "Rellena los datos para añadir un cliente al directorio.",
    "customers.form.name": "Nombre",
    "customers.form.phone": "Teléfono",
    "customers.form.email": "Email",
    "customers.form.business": "Negocio",
    "customers.form.cancel": "Cancelar",
    "customers.form.create": "Crear cliente",
    "customers.form.saving": "Guardando...",
    "customers.form.error.required": "Todos los campos son obligatorios.",
    "customers.form.error.create": "Error al crear el cliente. Inténtalo de nuevo.",

    "bookings.title": "Listado de Reservas",
    "bookings.subtitle": "Gestión de reservas conectada con la API.",
    "bookings.new": "Nueva reserva",
    "bookings.total": "Total reservas",
    "bookings.total.meta": "Registros disponibles",
    "bookings.pending.meta": "Requieren seguimiento",
    "bookings.confirmed.meta": "Estado activo",
    "bookings.paid.meta": "Reservas cerradas",
    "bookings.form.title": "Nueva reserva",
    "bookings.form.date": "Fecha",
    "bookings.form.time": "Hora",
    "bookings.form.status": "Estado",
    "bookings.form.customerId": "ID Cliente",
    "bookings.form.businessId": "ID Comercio",
    "bookings.form.serviceName": "Servicio",
    "bookings.form.edit": "Editar reserva",
    "bookings.form.save": "Guardar cambios",
    "bookings.form.create": "Crear reserva",
    "bookings.form.success.create": "Reserva creada correctamente.",
    "bookings.form.success.update": "Reserva actualizada correctamente.",
    "bookings.form.success.delete": "Reserva eliminada correctamente.",
    "bookings.form.error.create": "No se pudo crear la reserva. Revisa los datos o el backend.",
    "bookings.form.error.update": "No se pudo actualizar la reserva.",
    "bookings.form.error.delete": "No se pudo eliminar la reserva.",
    "bookings.delete.title": "Eliminar reserva",
    "bookings.delete.text": "¿Seguro que quieres eliminar la reserva #",
    "bookings.delete.confirm": "Esta acción no se puede deshacer.",
    "bookings.delete.action": "Eliminar",
    "bookings.delete.deleting": "Eliminando...",
    "bookings.list.title": "Reservas registradas",
    "bookings.filter.all": "Todas",

    "table.id": "ID",
    "table.customer": "Cliente",
    "table.amount": "Importe",
    "table.date": "Fecha",
    "table.status": "Estado",
    "table.action": "Acción",
    "table.time": "Hora",
    "table.business": "Comercio",
    "table.service": "Servicio",

    "action.print": "Imprimir",
    "status.paid": "Pagado",
    "status.pending": "Pendiente",
    "status.confirmed": "Confirmada",
    "status.paid_fem": "Pagada",

    "receipt.title": "RECIBO DE PAGO",
    "receipt.thanks": "Gracias por su compra",
    "receipt.id": "ID Pago",
    "receipt.method": "Método",
    "receipt.currency": "€"
  },
  en: {
    "app.title": "Bookings Admin",
    "app.subtitle": "Booking and payment management platform",
    "app.brand": "BookFlow",
    "app.workspace": "Admin workspace",

    "nav.dashboard": "Dashboard",
    "nav.bookings": "Bookings",
    "nav.customers": "Customers",
    "nav.payments": "Payments",

    "header.welcome": "Welcome back",
    "header.avatar": "AD",

    "dashboard.title": "Dashboard Overview",
    "dashboard.subtitle": "Daily control of bookings, activity and payments.",
    "dashboard.export": "Export Data",
    "dashboard.kpi.bookings": "Bookings today",
    "dashboard.kpi.bookings.meta": "+5 from yesterday",
    "dashboard.kpi.revenue": "Collected today",
    "dashboard.kpi.revenue.meta": "18 payments recorded",
    "dashboard.kpi.pending": "Pending",
    "dashboard.kpi.pending.meta": "Follow-up required",
    "dashboard.kpi.customers": "Active customers",
    "dashboard.kpi.customers.meta": "This month",

    "dashboard.next": "Upcoming bookings",
    "dashboard.viewAll": "View all",
    "dashboard.info.next": "Next booking",
    "dashboard.info.featured": "Featured business",
    "dashboard.info.featured.text": "6 bookings today",
    "dashboard.info.reminders": "Reminders",
    "dashboard.info.reminders.title": "4 pending confirmations",
    "dashboard.info.reminders.text": "Review recommended this morning",

    "payments.title": "Payments & Collections",
    "payments.subtitle": "Revenue management for commerce.",
    "payments.register": "Register payment",
    "payments.list": "List of Registered Payments",
    "payments.prompt.amount": "Enter the collection amount:",
    "payments.prompt.customer": "Enter the customer's name:",
    "payments.alert.success": "Payment registered successfully.",
    "payments.default_business": "General Commerce",

    "customers.title": "Customer Directory",
    "customers.subtitle": "Visual management of customers and upcoming bookings.",
    "customers.new": "New customer",
    "customers.search": "Search customer...",
    "customers.loading": "Loading customers...",
    "customers.empty": "No customers found.",
    "customers.error.load": "Could not load customers.",
    "customers.modal.title": "New customer",
    "customers.modal.text": "Fill in the details to add a customer to the directory.",
    "customers.form.name": "Name",
    "customers.form.phone": "Phone",
    "customers.form.email": "Email",
    "customers.form.business": "Business",
    "customers.form.cancel": "Cancel",
    "customers.form.create": "Create customer",
    "customers.form.saving": "Saving...",
    "customers.form.error.required": "All fields are required.",
    "customers.form.error.create": "Error creating customer. Please try again.",

    "bookings.title": "Bookings List",
    "bookings.subtitle": "Booking management connected to the API.",
    "bookings.new": "New booking",
    "bookings.total": "Total bookings",
    "bookings.total.meta": "Available records",
    "bookings.pending.meta": "Require follow-up",
    "bookings.confirmed.meta": "Active status",
    "bookings.paid.meta": "Closed bookings",
    "bookings.form.title": "New booking",
    "bookings.form.date": "Date",
    "bookings.form.time": "Time",
    "bookings.form.status": "Status",
    "bookings.form.customerId": "Customer ID",
    "bookings.form.businessId": "Business ID",
    "bookings.form.serviceName": "Service name",
    "bookings.form.edit": "Edit booking",
    "bookings.form.save": "Save changes",
    "bookings.form.create": "Create booking",
    "bookings.form.success.create": "Booking created successfully.",
    "bookings.form.success.update": "Booking updated successfully.",
    "bookings.form.success.delete": "Booking deleted successfully.",
    "bookings.form.error.create": "Could not create the booking. Check the data or the backend.",
    "bookings.form.error.update": "Could not update the booking.",
    "bookings.form.error.delete": "Could not delete the booking.",
    "bookings.delete.title": "Delete booking",
    "bookings.delete.text": "Are you sure you want to delete booking #",
    "bookings.delete.confirm": "This action cannot be undone.",
    "bookings.delete.action": "Delete",
    "bookings.delete.deleting": "Deleting...",
    "bookings.list.title": "Registered bookings",
    "bookings.filter.all": "All",

    "table.id": "ID",
    "table.customer": "Customer",
    "table.amount": "Amount",
    "table.date": "Date",
    "table.status": "Status",
    "table.action": "Action",
    "table.time": "Time",
    "table.business": "Business",
    "table.service": "Service",

    "action.print": "Print",
    "status.paid": "Paid",
    "status.pending": "Pending",
    "status.confirmed": "Confirmed",
    "status.paid_fem": "Paid",

    "receipt.title": "PAYMENT RECEIPT",
    "receipt.thanks": "Thank you for your purchase",
    "receipt.id": "Payment ID",
    "receipt.method": "Method",
    "receipt.currency": "€"
  }
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.es) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("es");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang) {
      setLangState(savedLang);
      document.documentElement.setAttribute("lang", savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.setAttribute("lang", newLang);
  };

  const t = (key: keyof typeof translations.es) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
