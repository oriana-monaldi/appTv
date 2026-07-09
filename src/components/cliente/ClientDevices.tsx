import { useEffect, useState } from "react";
import { ArrowLeft, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDevicesByClientId } from "../../services/clients";
import type { Device } from "../../types/clients";

const ClientDevices = () => {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      const clientId = localStorage.getItem("clientId");

      if (!clientId) {
        navigate("/login");
        return;
      }

      try {
        const devicesData = await getDevicesByClientId(clientId);
        setDevices(devicesData);
      } catch (error) {
        console.error("Error cargando televisores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, [navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        Cargando televisores...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white">
      <section className="mx-auto w-full max-w-md">
        <header className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Mis televisores</h1>
            <p className="text-xs text-slate-400">
              {devices.length} televisores asociados
            </p>
          </div>
        </header>

        {devices.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
            Todavía no tenés televisores asociados.
          </div>
        ) : (
          <section className="space-y-4">
            {devices.map((device) => (
              <article
                key={device.id}
                onClick={() =>
                  navigate(`/cliente/televisores/${device.id}/cuotas`)
                }
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:bg-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                    <Tv size={28} className="text-slate-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{device.nombre}</h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Modelo: {device.modelo}
                    </p>

                    <p className="text-xs text-slate-500">
                      Serie: {device.serie}
                    </p>

                    <p className="mt-2 text-xs text-slate-300">
                      {device.cuotas}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-3 py-1 text-xs font-bold ${
                      device.estado === "Activo"
                        ? "bg-green-950/40 text-green-400"
                        : "bg-red-950/40 text-red-400"
                    }`}
                  >
                    {device.estado}
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
};

export default ClientDevices;
