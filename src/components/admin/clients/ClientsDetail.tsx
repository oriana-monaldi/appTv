import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Tv, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClientById,
  getDevicesByClientId,
  updateDeviceStatus,
} from "../../../services/clients";
import type { Client, Device } from "../../../types/clients";

const ClientsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [client, setClient] = useState<Client | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientDetail = async () => {
      if (!id) return;

      try {
        const clientData = await getClientById(id);
        const devicesData = await getDevicesByClientId(id);

        setClient(clientData);
        setDevices(devicesData);
      } catch (error) {
        console.error("Error cargando detalle del cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClientDetail();
  }, [id]);

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
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800"
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

            <button
              type="button"
              onClick={() => navigate(`/admin/clientes/${id}/editar`)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500 text-blue-400 transition hover:bg-blue-950/30"
            >
              <Pencil size={17} />
            </button>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <strong className="text-white">DNI:</strong> {client.dni}
            </p>
            <p>
              <strong className="text-white">Teléfono:</strong>{" "}
              {client.telefono}
            </p>
            <p>
              <strong className="text-white">Email:</strong> {client.email}
            </p>
            <p>
              <strong className="text-white">Dirección:</strong>{" "}
              {client.direccion}
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
                      Modelo: {device.modelo}
                    </p>
                    <p className="text-xs text-slate-500">
                      Serie: {device.serie}
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
