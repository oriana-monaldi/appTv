import { useEffect, useState } from "react";
import { Bell, Menu, Search, SlidersHorizontal, Tv, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../layout/AdminMenu";
import { getClients, getDevicesByClientId } from "../../../services/clients";
import type { Client, Device } from "../../../types/clients";

const Clientes = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [devicesByClient, setDevicesByClient] = useState<
    Record<string, Device | undefined>
  >({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsData = await getClients();
        setClientes(clientsData);

        const devicesMap: Record<string, Device | undefined> = {};

        for (const client of clientsData) {
          const devices = await getDevicesByClientId(client.id);
          devicesMap[client.id] = devices[0];
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

  const clientesFiltrados = clientes.filter((cliente) => {
    const device = devicesByClient[cliente.id];

    const coincideNombre = cliente.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const coincideMarca = brandFilter === "" || device?.marca === brandFilter;

    return coincideNombre && coincideMarca;
  });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white md:px-8 md:py-8">
      <AdminMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-5 flex items-center justify-between">
          <button
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
            onClick={() => navigate("/admin/clientes/nuevo")}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500"
          >
            <Plus size={20} />
          </button>
        </header>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <Search size={18} className="text-slate-500" />

            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="h-12 rounded-xl border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none"
          >
            <option value="">Todas</option>
            <option value="Samsung">Samsung</option>
            <option value="LG">LG</option>
            <option value="TCL">TCL</option>
            <option value="Philco">Philco</option>
            <option value="Noblex">Noblex</option>
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Cargando clientes...</p>
        ) : clientesFiltrados.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center text-sm text-slate-400">
            No se encontraron clientes.
          </div>
        ) : (
          <section className="space-y-3 md:overflow-hidden md:rounded-2xl md:border md:border-slate-800 md:bg-slate-900 md:space-y-0">
            <div className="hidden grid-cols-3 border-b border-slate-800 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>Cliente</span>
              <span>Televisor</span>
              <span>Cuotas</span>
            </div>

            {clientesFiltrados.map((cliente) => {
              const device = devicesByClient[cliente.id];

              return (
                <article
                  key={cliente.id}
                  onClick={() => navigate(`/admin/clientes/${cliente.id}`)}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:bg-slate-800 md:grid md:grid-cols-3 md:items-center md:rounded-none md:border-0 md:border-b md:border-slate-800 md:p-5"
                >
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-semibold text-white">
                      {cliente.nombre}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {cliente.telefono || "Sin teléfono"}
                    </p>
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-300 md:mb-0">
                    <Tv size={16} className="text-slate-500 md:hidden" />
                    <span>{device?.nombre || "Sin televisor"}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm md:block">
                    <span className="text-slate-500 md:hidden">Cuotas</span>
                    <strong className="font-semibold text-white">
                      {device?.cuotas || "-"}
                    </strong>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
};

export default Clientes;
