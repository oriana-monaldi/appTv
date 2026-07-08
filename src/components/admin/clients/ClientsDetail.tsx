import { ArrowLeft, Plus, Tv, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const client = {
  id: 1,
  nombre: "Juan Pérez",
  dni: "12.345.678",
  telefono: "11 2345 5678",
  direccion: "Av. Corrientes 1234, CABA",
};

const devices = [
  {
    id: 1,
    nombre: "Samsung 50” Smart TV",
    modelo: "50TU7000",
    serie: "1234567890",
    estado: "Activo",
    cuotas: "5 / 12",
    proximaCuota: "10/06/2024",
  },
  {
    id: 2,
    nombre: "LG 43” Smart TV",
    modelo: "43LM6300",
    serie: "9876543210",
    estado: "Inactivo",
    cuotas: "12 / 12",
    proximaCuota: "-",
  },
];

const ClientDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white md:px-8 md:py-8">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-5 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Detalle del cliente</h1>
            <p className="text-xs text-slate-400">Cliente ID: {id}</p>
          </div>
        </header>

        <section className="mb-5 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-400">
              <User size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold">{client.nombre}</h2>
              <span className="rounded-full bg-green-950/40 px-3 py-1 text-xs font-semibold text-green-400">
                Activo
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <strong className="text-white">DNI:</strong> {client.dni}
            </p>
            <p>
              <strong className="text-white">Tel:</strong> {client.telefono}
            </p>
            <p>
              <strong className="text-white">Dirección:</strong>{" "}
              {client.direccion}
            </p>
          </div>
        </section>

        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">Televisores</h2>

            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-500">
              <Plus size={16} />
              Agregar
            </button>
          </div>

          <div className="space-y-3">
            {devices.map((device) => (
              <article
                key={device.id}
                onClick={() =>
                  navigate(
                    `/admin/clientes/${client.id}/televisores/${device.id}`,
                  )
                }
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:bg-slate-800"
              >
                <div className="flex gap-4">
                  <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                    <Tv size={26} className="text-slate-400" />
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h3 className="font-bold leading-tight text-white">
                        {device.nombre}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          device.estado === "Activo"
                            ? "bg-green-950/40 text-green-400"
                            : "bg-red-950/40 text-red-400"
                        }`}
                      >
                        {device.estado}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Modelo: {device.modelo}
                    </p>
                    <p className="text-xs text-slate-500">
                      N° Serie: {device.serie}
                    </p>

                    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                      <p>
                        <strong className="text-white">Cuotas:</strong>{" "}
                        {device.cuotas}
                      </p>
                      <p>
                        <strong className="text-white">Próxima cuota:</strong>{" "}
                        {device.proximaCuota}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-3 text-base font-bold">Acciones</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button className="rounded-xl border border-blue-500 px-4 py-3 text-sm font-bold text-blue-400 transition hover:bg-blue-950/40">
              Editar cliente
            </button>

            <button className="rounded-xl border border-red-500 px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-950/40">
              Desactivar cliente
            </button>
          </div>
        </section>
      </section>
    </main>
  );
};

export default ClientDetail;
