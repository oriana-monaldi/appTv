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

            return {
              device,
              client,
            };
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
    const clientName = item.client?.nombre?.toLowerCase() || "";
    const tvName = item.device.nombre?.toLowerCase() || "";
    const term = search.toLowerCase();

    return clientName.includes(term) || tvName.includes(term);
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
      <section className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center gap-4">
          <button
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
            placeholder="Buscar cliente o televisor..."
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
          <section className="space-y-3 md:overflow-hidden md:rounded-2xl md:border md:border-slate-800 md:bg-slate-900 md:space-y-0">
            <div className="hidden grid-cols-4 border-b border-slate-800 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>Cliente</span>
              <span>Televisor</span>
              <span>Estado</span>
              <span>Acción</span>
            </div>

            {filteredItems.map(({ device, client }) => (
              <article
                key={device.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid md:grid-cols-4 md:items-center md:rounded-none md:border-0 md:border-b md:border-slate-800 md:p-5"
              >
                <div className="mb-3 md:mb-0">
                  <h3 className="font-semibold text-white">
                    {client?.nombre || "Cliente no encontrado"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {client?.telefono || "Sin teléfono"}
                  </p>
                </div>

                <div className="mb-3 flex items-center gap-2 text-sm text-slate-300 md:mb-0">
                  <Tv size={16} className="text-slate-500" />
                  <span>{device.nombre}</span>
                </div>

                <div className="mb-4 md:mb-0">
                  <span className="rounded-full bg-red-950/40 px-3 py-1 text-xs font-bold text-red-400">
                    Inactivo
                  </span>
                </div>

                <div className="flex gap-2 md:justify-end">
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
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
};

export default InactiveServices;
