import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getDevices } from "../../../services/clients";
import type { Device } from "../../../types/clients";

const TelevisoresActivos = () => {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await getDevices();

        setDevices(
          data.filter((device) => device.estado === "Activo"),
        );
      } catch (error) {
        console.error("Error cargando televisores activos:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadDevices();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        Cargando televisores activos...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-5xl">
        <header className="mb-7 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">Televisores activos</h1>

            <p className="text-sm text-slate-400">
              Total activos: {devices.length}
            </p>
          </div>
        </header>

        {devices.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
            No hay televisores activos.
          </div>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => (
              <article
                key={device.id}
                onClick={() =>
                  navigate(
                    `/admin/clientes/${device.clientId}/televisores/${device.id}`,
                  )
                }
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-green-500 hover:bg-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                    <Tv size={28} className="text-slate-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold">{device.nombre}</h2>

                        <p className="mt-2 text-xs text-slate-500">
                          Modelo: {device.modelo}
                        </p>

                        <p className="text-xs text-slate-500">
                          Serie: {device.serie}
                        </p>

                        <p className="mt-2 text-xs text-slate-300">
                          Cuotas: {device.cuotas}
                        </p>
                      </div>

                      <span className="flex items-center gap-1 rounded-full bg-green-950/40 px-3 py-1 text-xs font-bold text-green-400">
                        <CheckCircle2 size={14} />
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TelevisoresActivos;