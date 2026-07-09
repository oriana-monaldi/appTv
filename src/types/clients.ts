export type Client = {
  id: string;
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  password: string;
  role: "admin" | "client";
  direccion: string;
  estado: "Activo" | "Inactivo";
};

export type Device = {
  id: string;
  clientId: string;
  nombre: string;
  marca: string;
  modelo: string;
  serie: string;
  estado: "Activo" | "Inactivo";
  cuotas: string;

  cantidadCuotas?: number;
  cuotasPagas?: number;
  fechaInicio?: string;
  precioTotal?: number;
  valorCuota?: number;
};

export type Installment = {
  id: string;
  deviceId: string;
  numero: number;
  fecha: string;
  monto: number;
  estado: "Pagada" | "Pendiente";
};
