export type AppointmentStatus = "pending" | "confirmed" | "paid";

export type Appointment = {
  id: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
};

//customers
export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  business: string;
};