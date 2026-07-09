import { useEffect, useState } from "react";
import { Menu, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../layout/AdminMenu";
import { getClients, getDevicesByClientId } from "../../../services/clients";
import type { Client, Device } from "../../../types/clients";

const Clientes = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [devicesByClient, setDevicesByClient] = useState<
    Record<string, Device[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsData = await getClients();
        setClientes(clientsData);

        const devicesMap: Record<string, Device[]> = {};

        for (const client of clientsData) {
          devicesMap[client.id] = await getDevicesByClientId(client.id);
        }

        setDevicesByClient(devicesMap);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white md:px-8 md:py-8">
      <AdminMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold md:text-2xl">Clientes</h1>
            <p className="text-xs text-slate-400 md:text-sm">
              Clientes registrados
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/clientes/nuevo")}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500"
          >
            <Plus size={20} />
          </button>
        </header>

        <div className="mb-5 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Cargando clientes...</p>
        ) : clientesFiltrados.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center text-sm text-slate-400">
            No se encontraron clientes.
          </div>
        ) : (
          <>
            <section className="space-y-3 md:hidden">
              {clientesFiltrados.map((cliente) => {
                const cantidadTelevisores =
                  devicesByClient[cliente.id]?.length ?? 0;

                return (
                  <article
                    key={cliente.id}
                    onClick={() => navigate(`/admin/clientes/${cliente.id}`)}
                    className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500 hover:bg-slate-800"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-white">
                        {cliente.nombre}
                      </h3>

                      <span className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
                        Ver detalle →
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-14 text-xs text-slate-500">
                            DNI:
                          </span>
                          <span className="text-sm text-white">
                            {cliente.dni}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-14 text-xs text-slate-500">
                            Tel:
                          </span>
                          <span className="truncate text-sm text-white">
                            {cliente.telefono || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="flex min-w-[70px] flex-col items-center justify-center">
                        <span className="text-xl">📺</span>
                        <span className="text-2xl font-bold text-white">
                          {cantidadTelevisores}
                        </span>
                        <span className="text-[11px] text-slate-500">TVs</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4 font-semibold">Cliente</th>
                    <th className="px-5 py-4 font-semibold">DNI</th>
                    <th className="px-5 py-4 font-semibold">Teléfono</th>
                    <th className="px-5 py-4 text-center font-semibold">TVs</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {clientesFiltrados.map((cliente) => {
                    const cantidadTelevisores =
                      devicesByClient[cliente.id]?.length ?? 0;

                    return (
                      <tr
                        key={cliente.id}
                        onClick={() =>
                          navigate(`/admin/clientes/${cliente.id}`)
                        }
                        className="cursor-pointer border-b border-slate-800 transition last:border-b-0 hover:bg-slate-800"
                      >
                        <td className="px-5 py-4 font-semibold text-white">
                          {cliente.nombre}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {cliente.dni}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {cliente.telefono || "Sin teléfono"}
                        </td>

                        <td className="px-5 py-4 text-center text-sm font-bold text-white">
                          {cantidadTelevisores}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                            Ver →
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </>
        )}
      </section>
    </main>
  );
};

export default Clientes;
