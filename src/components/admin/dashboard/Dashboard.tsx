import { useState } from "react";
import {
  Menu,
  Bell,
  Users,
  Tv,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import AdminMenu from "../../layout/AdminMenu";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-5 md:px-8 md:py-8">
      <AdminMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="mx-auto max-w-6xl">
        {/* HEADER */}

        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Resumen general del sistema
            </p>
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800">
            <Bell size={18} />
          </button>
        </header>

        {/* STATS */}

        <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <Users className="mb-2 text-blue-400" size={18} />

            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Clientes
            </p>

            <h2 className="mt-1 text-xl font-bold md:text-2xl">1.248</h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <Tv className="mb-2 text-cyan-400" size={18} />

            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              TVs
            </p>

            <h2 className="mt-1 text-xl font-bold md:text-2xl">1.356</h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <CheckCircle2 className="mb-2 text-green-400" size={18} />

            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Activos
            </p>

            <h2 className="mt-1 text-xl font-bold md:text-2xl">1.102</h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <XCircle className="mb-2 text-red-400" size={18} />

            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Inactivos
            </p>

            <h2 className="mt-1 text-xl font-bold md:text-2xl">254</h2>
          </div>
        </section>

        {/* GRAFICO */}

        <section className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Estado de los servicios
          </h2>

          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28 shrink-0 rounded-full bg-[conic-gradient(#3B82F6_0_81%,#374151_81%_100%)] md:h-36 md:w-36">
              <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-slate-900 md:h-20 md:w-20" />
            </div>

            <div className="flex flex-1 flex-col gap-3 text-sm">
              <div className="flex items-center">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                <span className="ml-2 text-xs text-slate-300">Activos</span>

                <strong className="ml-auto text-sm">81%</strong>
              </div>

              <div className="flex items-center">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />

                <span className="ml-2 text-xs text-slate-300">Inactivos</span>

                <strong className="ml-auto text-sm">19%</strong>
              </div>
            </div>
          </div>
        </section>
        {/* ALERTAS */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-lg font-semibold">Alertas</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-red-900 bg-red-950/30 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-400" size={20} />
                <span className="text-sm">Hay 3 servicios vencidos.</span>
              </div>

              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm transition hover:bg-red-500">
                Ver
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-orange-900 bg-orange-950/30 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-400" size={20} />
                <span className="text-sm">
                  Existen 2 pagos pendientes de validar.
                </span>
              </div>

              <button className="rounded-lg bg-orange-600 px-4 py-2 text-sm transition hover:bg-orange-500">
                Ver
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
