import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Tv,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getDevices } from "../../../services/clients";
import type { Device } from "../../../types/clients";

const ListadoTelevisores = () => {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (error) {
        console.error("Error cargando televisores:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadDevices();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        Cargando televisores...
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
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">Televisores</h1>

            <p className="text-sm text-slate-400">
              Total registrados: {devices.length}
            </p>
          </div>
        </header>

        {devices.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
            No hay televisores registrados.
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
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500 hover:bg-slate-800"
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

                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          device.estado === "Activo"
                            ? "bg-green-950/40 text-green-400"
                            : "bg-red-950/40 text-red-400"
                        }`}
                      >
                        {device.estado === "Activo" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}

                        {device.estado}
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

export default ListadoTelevisores;