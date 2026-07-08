import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Client, Device, Installment } from "../types/clients";

type DevicePayload = {
  clientId: string;
  marca: string;
  modelo: string;
  serie: string;
  cantidadCuotas: string;
  fechaInicio: string;
};

export const getClients = async (): Promise<Client[]> => {
  const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  })) as Client[];
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const ref = doc(db, "clients", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as Client;
};

export const getDevicesByClientId = async (
  clientId: string,
): Promise<Device[]> => {
  const q = query(collection(db, "devices"), where("clientId", "==", clientId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  })) as Device[];
};

export const getDeviceById = async (
  deviceId: string,
): Promise<Device | null> => {
  const ref = doc(db, "devices", deviceId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as Device;
};

const createDevice = async ({
  clientId,
  marca,
  modelo,
  serie,
  cantidadCuotas,
  fechaInicio,
}: DevicePayload): Promise<string> => {
  const deviceRef = await addDoc(collection(db, "devices"), {
    clientId,
    nombre: `${marca} ${modelo}`,
    marca,
    modelo,
    serie,
    estado: "Activo",
    cuotas: `0 / ${cantidadCuotas}`,
    cantidadCuotas: Number(cantidadCuotas),
    cuotasPagas: 0,
    fechaInicio,
    createdAt: serverTimestamp(),
  });

  await createInstallmentsForDevice({
    deviceId: deviceRef.id,
    cantidadCuotas: Number(cantidadCuotas),
    fechaInicio,
    monto: "$25.000",
  });

  return deviceRef.id;
};

export const createClientWithDevice = async ({
  nombre,
  dni,
  telefono,
  email,
  direccion,
  marca,
  modelo,
  serie,
  cantidadCuotas,
  fechaInicio,
}: {
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
  marca: string;
  modelo: string;
  serie: string;
  cantidadCuotas: string;
  fechaInicio: string;
}) => {
  const clientRef = await addDoc(collection(db, "clients"), {
    nombre,
    dni,
    telefono,
    email,
    direccion,
    password: dni,
    role: "client",
    estado: "Activo",
    createdAt: serverTimestamp(),
  });

  await createDevice({
    clientId: clientRef.id,
    marca,
    modelo,
    serie,
    cantidadCuotas,
    fechaInicio,
  });

  return clientRef.id;
};

export const createDeviceForClient = async (payload: DevicePayload) => {
  return createDevice(payload);
};

export const createInstallmentsForDevice = async ({
  deviceId,
  cantidadCuotas,
  fechaInicio,
  monto,
}: {
  deviceId: string;
  cantidadCuotas: number;
  fechaInicio: string;
  monto: string;
}) => {
  for (let i = 1; i <= cantidadCuotas; i++) {
    const fecha = new Date(`${fechaInicio}T00:00:00`);
    fecha.setMonth(fecha.getMonth() + (i - 1));

    await addDoc(collection(db, "installments"), {
      deviceId,
      numero: i,
      fecha: fecha.toISOString().split("T")[0],
      monto,
      estado: "Pendiente",
      createdAt: serverTimestamp(),
    });
  }
};

export const getInstallmentsByDeviceId = async (
  deviceId: string,
): Promise<Installment[]> => {
  const q = query(
    collection(db, "installments"),
    where("deviceId", "==", deviceId),
  );

  const snapshot = await getDocs(q);

  const installments = snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  })) as Installment[];

  return installments.sort((a, b) => a.numero - b.numero);
};

export const updateInstallmentStatus = async (
  installmentId: string,
  estado: "Pagada" | "Pendiente",
) => {
  const ref = doc(db, "installments", installmentId);

  await updateDoc(ref, {
    estado,
    updatedAt: serverTimestamp(),
  });
};

export const updateClient = async ({
  clientId,
  nombre,
  dni,
  telefono,
  email,
  direccion,
}: {
  clientId: string;
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
}) => {
  const ref = doc(db, "clients", clientId);

  await updateDoc(ref, {
    nombre,
    dni,
    telefono,
    email,
    direccion,
    password: dni,
    updatedAt: serverTimestamp(),
  });
};

export const loginClient = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Client | null> => {
  const q = query(
    collection(db, "clients"),
    where("email", "==", email),
    where("password", "==", password),
    where("role", "==", "client"),
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const document = snapshot.docs[0];

  return {
    ...document.data(),
    id: document.id,
  } as Client;
};

export const updateDeviceStatus = async ({
  deviceId,
  estado,
}: {
  deviceId: string;
  estado: "Activo" | "Inactivo";
}) => {
  const ref = doc(db, "devices", deviceId);

  await updateDoc(ref, {
    estado,
    updatedAt: serverTimestamp(),
  });
};
