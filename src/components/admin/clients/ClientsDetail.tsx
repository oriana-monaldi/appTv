import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2, Tv, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  deleteClientCompletely,
  getClientById,
  getDevicesByClientId,
} from "../../../services/clients";

import type { Client, Device } from "../../../types/clients";

const ClientsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [client, setClient] = useState<Client | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadClientDetail = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const clientData = await getClientById(id);
        const devicesData = await getDevicesByClientId(id);

        setClient(clientData);
        setDevices(devicesData);
      } catch (error) {
        console.error("Error cargando detalle del cliente:", error);
        toast.error("No se pudo cargar el cliente.");
      } finally {
        setLoading(false);
      }
    };

    void loadClientDetail();
  }, [id]);

  const handleDeleteClient = () => {
    if (!id || !client) {
      toast.error("No se pudo identificar al cliente.");
      return;
    }

    toast.custom(
      (currentToast) => (
        <div className="w-[calc(100vw-32px)] max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <Trash2 size={22} className="text-red-400" />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold">Eliminar cliente</h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                ¿Estás seguro de que querés eliminar a{" "}
                <span className="font-semibold text-white">
                  {client.nombre}
                </span>
                ?
              </p>

              <p className="mt-2 text-xs leading-5 text-red-300">
                También se eliminarán sus televisores, cuotas y toda la
                información asociada. Esta acción no se puede deshacer.
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => toast.dismiss(currentToast.id)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={async () => {
                    try {
                      setDeleting(true);

                      await deleteClientCompletely(id);

                      toast.dismiss(currentToast.id);

                      toast.success(
                        `${client.nombre} fue eliminado correctamente.`,
                      );

                      navigate("/admin/clientes", {
                        replace: true,
                      });
                    } catch (error) {
                      console.error("Error eliminando cliente:", error);

                      toast.dismiss(currentToast.id);

                      toast.error(
                        "No se pudo eliminar el cliente. Intentá nuevamente.",
                      );
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Eliminando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-5 text-white">
        <p className="text-sm text-slate-400">Cargando detalle...</p>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-5 text-white">
        <p className="text-sm text-slate-400">Cliente no encontrado.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Detalle del cliente</h1>

            <p className="text-xs text-slate-400">Cliente ID: {id}</p>
          </div>
        </header>

        <section className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
                <User size={24} className="text-slate-400" />
              </div>

              <h2 className="text-lg font-bold">{client.nombre}</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/admin/clientes/${id}/editar`)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500 text-blue-400 transition hover:bg-blue-950/30"
                aria-label="Editar cliente"
                title="Editar cliente"
              >
                <Pencil size={17} />
              </button>

              <button
                type="button"
                onClick={handleDeleteClient}
                disabled={deleting}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/50 text-red-400 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Eliminar a ${client.nombre}`}
                title="Eliminar cliente"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <strong className="text-white">DNI:</strong> {client.dni || "-"}
            </p>

            <p>
              <strong className="text-white">Teléfono:</strong>{" "}
              {client.telefono || "-"}
            </p>

            <p>
              <strong className="text-white">Email:</strong>{" "}
              {client.email || "-"}
            </p>

            <p>
              <strong className="text-white">Dirección:</strong>{" "}
              {client.direccion || "-"}
            </p>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Televisores</h2>

          <button
            type="button"
            onClick={() => navigate(`/admin/clientes/${id}/agregar-televisor`)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold transition hover:bg-blue-500"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>

        {devices.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
            Este cliente todavía no tiene televisores cargados.
          </div>
        ) : (
          <div className="space-y-5">
            {devices.map((device) => (
              <section
                key={device.id}
                onClick={() =>
                  navigate(`/admin/clientes/${id}/televisores/${device.id}`)
                }
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all hover:border-blue-500 hover:bg-slate-800"
              >
                <div className="mb-5 flex gap-4">
                  <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                    <Tv size={30} className="text-slate-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold">{device.nombre}</h3>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                          device.estado === "Activo"
                            ? "bg-green-950/40 text-green-400"
                            : "bg-red-950/40 text-red-400"
                        }`}
                      >
                        {device.estado}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Modelo: {device.modelo || "-"}
                    </p>

                    <p className="text-xs text-slate-500">
                      Serie: {device.serie || "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="mb-3 font-semibold">Suscripción</h4>

                  <div className="space-y-2 text-sm text-slate-300">
                    <p>
                      <strong className="text-white">Plan:</strong>{" "}
                      {device.cantidadCuotas ?? "-"} cuotas mensuales
                    </p>

                    <p>
                      <strong className="text-white">Cuota actual:</strong>{" "}
                      {device.cuotas ?? "-"}
                    </p>

                    <p>
                      <strong className="text-white">Fecha de inicio:</strong>{" "}
                      {device.fechaInicio ?? "-"}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ClientsDetail;
