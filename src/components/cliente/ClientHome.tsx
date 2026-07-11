import { useEffect, useState } from "react";
import { CheckCircle2, Menu, Monitor, Tv, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ClientMenu from "./ClientMenu";
import { getClientById, getDevicesByClientId } from "../../services/clients";
import type { Client, Device } from "../../types/clients";

const ClientHome = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [client, setClient] = useState<Client | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      const clientId = localStorage.getItem("clientId");

      if (!clientId) {
        navigate("/login");
        return;
      }

      try {
        const clientData = await getClientById(clientId);
        const devicesData = await getDevicesByClientId(clientId);

        setClient(clientData);
        setDevices(devicesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Cargando...
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Cliente no encontrado.
      </main>
    );
  }

  const total = devices.length;
  const activos = devices.filter((d) => d.estado === "Activo").length;
  const inactivos = devices.filter((d) => d.estado === "Inactivo").length;

  return (
    <>
      <ClientMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-h-screen bg-slate-950 px-4 pb-24 pt-5 text-white">
        <section className="mx-auto max-w-md">
          <header className="mb-8 flex items-center justify-between">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900"
            >
              <Menu size={22} />
            </button>
          </header>

          <section className="mb-6">
            <h1 className="text-3xl font-bold">Hola, {client.nombre} 👋</h1>

            <p className="mt-1 text-sm text-slate-400">Bienvenido nuevamente</p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-5 text-lg font-bold">Estado general</h2>

            <div className="grid grid-cols-3 divide-x divide-slate-800 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-400">{total}</p>

                <p className="mt-1 text-xs text-slate-400">Televisores</p>

                <Monitor size={20} className="mx-auto mt-3 text-slate-500" />
              </div>

              <div>
                <p className="text-3xl font-bold text-green-400">{activos}</p>

                <p className="mt-1 text-xs text-slate-400">Activos</p>

                <CheckCircle2
                  size={20}
                  className="mx-auto mt-3 text-green-500"
                />
              </div>

              <div>
                <p className="text-3xl font-bold text-red-400">{inactivos}</p>

                <p className="mt-1 text-xs text-slate-400">Inactivos</p>

                <XCircle size={20} className="mx-auto mt-3 text-red-500" />
              </div>
            </div>
          </section>

          <section id="mis-televisores">
            <h2 className="mb-4 text-xl font-bold">Mis televisores</h2>
            {devices.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                Todavía no tenés televisores asociados.
              </div>
            ) : (
              <div className="space-y-4">
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

                      <div className="flex-1">
                        <h3 className="font-bold">{device.nombre}</h3>

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
                        className={`rounded-lg px-3 py-1 text-xs font-bold ${
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
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
};

export default ClientHome;
