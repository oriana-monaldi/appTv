import { useState } from "react";
import { ArrowLeft, Calendar, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../layout/AdminMenu";

const NuevoCliente = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white md:px-8 md:py-8">
      <AdminMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold md:text-2xl">Nuevo cliente</h1>
            <p className="text-xs text-slate-400">Alta de servicio</p>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>
        </header>

        <form className="space-y-4">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Datos del cliente
            </h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  DNI
                </label>
                <input
                  type="text"
                  placeholder="Ej: 12.345.678"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Teléfono
                </label>
                <input
                  type="text"
                  placeholder="Ej: 11 2345 5678"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Corrientes 1234"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Datos del televisor
            </h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Marca
                </label>
                <select className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500">
                  <option>Seleccionar marca</option>
                  <option>Samsung</option>
                  <option>LG</option>
                  <option>TCL</option>
                  <option>Philco</option>
                  <option>Noblex</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Modelo
                </label>
                <input
                  type="text"
                  placeholder="Ej: 50TU7000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  N° Serie
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1234567890"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Suscripción
            </h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Cantidad de cuotas
                </label>
                <select className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500">
                  <option>Seleccionar cuotas</option>
                  <option>3 cuotas</option>
                  <option>6 cuotas</option>
                  <option>12 cuotas</option>
                  <option>18 cuotas</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Fecha de inicio
                </label>

                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <input
                    type="date"
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                  <Calendar size={18} className="text-slate-500" />
                </div>
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Guardar cliente
          </button>
        </form>
      </section>
    </main>
  );
};

export default NuevoCliente;
