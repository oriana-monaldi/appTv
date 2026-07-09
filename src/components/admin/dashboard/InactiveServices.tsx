import { useEffect, useState } from "react";
import { ArrowLeft, Search, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getDevices,
  getClientById,
  updateDeviceStatus,
} from "../../../services/clients";
import type { Client, Device } from "../../../types/clients";

type InactiveItem = {
  device: Device;
  client: Client | null;
};

const InactiveServices = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<InactiveItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInactiveServices = async () => {
      try {
        const devices = await getDevices();

        const inactiveDevices = devices.filter(
          (device) => device.estado === "Inactivo",
        );

        const data = await Promise.all(
          inactiveDevices.map(async (device) => {
            const client = await getClientById(device.clientId);
            return { device, client };
          }),
        );

        setItems(data);
      } catch (error) {
        console.error("Error cargando servicios inactivos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInactiveServices();
  }, []);

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();

    return (
      item.client?.nombre?.toLowerCase().includes(term) ||
      item.device.nombre?.toLowerCase().includes(term) ||
      item.device.serie?.toLowerCase().includes(term)
    );
  });

  const habilitarTelevisor = async (deviceId: string) => {
    try {
      await updateDeviceStatus({
        deviceId,
        estado: "Activo",
      });

      setItems((prev) => prev.filter((item) => item.device.id !== deviceId));
    } catch (error) {
      console.error("Error habilitando televisor:", error);
      alert("No se pudo habilitar el televisor.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white md:px-8 md:py-8">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold md:text-2xl">
              Servicios inactivos
            </h1>
            <p className="text-sm text-slate-400">
              {loading
                ? "Cargando servicios..."
                : `${filteredItems.length} servicios encontrados`}
            </p>
          </div>
        </header>

        <div className="mb-5 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <Search size={18} className="text-slate-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Buscar cliente, televisor o serie..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Cargando...</p>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center text-sm text-slate-400">
            No hay servicios inactivos.
          </div>
        ) : (
          <>
            <section className="space-y-3 md:hidden">
              {filteredItems.map(({ device, client }) => (
                <article
                  key={device.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">
                        {client?.nombre || "Cliente no encontrado"}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {client?.telefono || "Sin teléfono"}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-950/40 px-3 py-1 text-xs font-bold text-red-400">
                      Inactivo
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Tv size={16} className="text-slate-500" />
                    <span>{device.nombre}</span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Serie: {device.serie || "-"}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/clientes/${device.clientId}/televisores/${device.id}`,
                        )
                      }
                      className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                    >
                      Ver detalle
                    </button>

                    <button
                      type="button"
                      onClick={() => habilitarTelevisor(device.id)}
                      className="rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500"
                    >
                      Habilitar
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <section className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4 font-semibold">Cliente</th>
                    <th className="px-5 py-4 font-semibold">Televisor</th>
                    <th className="px-5 py-4 font-semibold">Serie</th>
                    <th className="px-5 py-4 font-semibold">Estado</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map(({ device, client }) => (
                    <tr
                      key={device.id}
                      className="border-b border-slate-800 transition last:border-b-0 hover:bg-slate-800"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">
                          {client?.nombre || "Cliente no encontrado"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {client?.telefono || "Sin teléfono"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {device.nombre}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {device.serie || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-red-950/40 px-3 py-1 text-xs font-bold text-red-400">
                          Inactivo
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/clientes/${device.clientId}/televisores/${device.id}`,
                              )
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                          >
                            Ver
                          </button>

                          <button
                            type="button"
                            onClick={() => habilitarTelevisor(device.id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
                          >
                            Habilitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </section>
    </main>
  );
};

export default InactiveServices;
