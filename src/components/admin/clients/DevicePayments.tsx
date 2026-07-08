import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Tv } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDeviceById,
  getInstallmentsByDeviceId,
  updateDeviceStatus,
  updateInstallmentStatus,
} from "../../../services/clients";
import type { Device, Installment } from "../../../types/clients";

const DevicePayments = () => {
  const navigate = useNavigate();
  const { clientId, deviceId } = useParams();

  const [device, setDevice] = useState<Device | null>(null);
  const [cuotas, setCuotas] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!deviceId) return;

      try {
        const deviceData = await getDeviceById(deviceId);
        const cuotasData = await getInstallmentsByDeviceId(deviceId);

        setDevice(deviceData);
        setCuotas(cuotasData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [deviceId]);

  const cambiarEstadoCuota = async (cuota: Installment) => {
    const nuevoEstado = cuota.estado === "Pagada" ? "Pendiente" : "Pagada";

    await updateInstallmentStatus(cuota.id, nuevoEstado);

    setCuotas((prev) =>
      prev.map((item) =>
        item.id === cuota.id ? { ...item, estado: nuevoEstado } : item,
      ),
    );
  };

  const cambiarEstadoTelevisor = async () => {
    if (!device) return;

    const nuevoEstado = device.estado === "Activo" ? "Inactivo" : "Activo";

    await updateDeviceStatus({
      deviceId: device.id,
      estado: nuevoEstado,
    });

    setDevice({
      ...device,
      estado: nuevoEstado,
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        Cargando pagos...
      </main>
    );
  }

  if (!device) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        No se encontró el televisor. ID: {deviceId}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Pagos del televisor</h1>
            <p className="text-xs text-slate-400">
              Cliente: {clientId} · TV: {deviceId}
            </p>
          </div>
        </header>

        <section
          className={`mb-5 rounded-xl border-2 bg-slate-900 p-4 ${
            device.estado === "Activo" ? "border-green-500" : "border-red-500"
          }`}
        >
          {" "}
          <div className="flex gap-4">
            <div className="flex h-14 w-16 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
              <Tv size={26} className="text-slate-400" />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h2 className="font-bold">{device.nombre}</h2>

                <span
                  className={`rounded-xl px-4 py-2 text-sm font-bold ${
                    device.estado === "Activo"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {device.estado}
                </span>
              </div>

              <p className="text-xs text-slate-500">Modelo: {device.modelo}</p>
              <p className="text-xs text-slate-500">Serie: {device.serie}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  <strong>Plan:</strong> {device.cantidadCuotas ?? "-"} cuotas
                </p>

                <button
                  type="button"
                  onClick={cambiarEstadoTelevisor}
                  className={`rounded-lg px-3 py-1 text-[11px] font-semibold transition ${
                    device.estado === "Activo"
                      ? "bg-red-600 text-white hover:bg-red-500"
                      : "bg-green-600 text-white hover:bg-green-500"
                  }`}
                >
                  {device.estado === "Activo" ? "Inhabilitar" : "Habilitar"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <h2 className="mb-3 font-bold">Cuotas</h2>

        <div className="space-y-3">
          {cuotas.map((cuota) => {
            const pagada = cuota.estado === "Pagada";

            return (
              <article
                key={cuota.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                        pagada
                          ? "border-green-900 bg-green-950/40 text-green-400"
                          : "border-orange-900 bg-orange-950/40 text-orange-400"
                      }`}
                    >
                      {pagada ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        Cuota {cuota.numero}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Vence: {cuota.fecha}
                      </p>
                      <p className="text-sm font-semibold">{cuota.monto}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => cambiarEstadoCuota(cuota)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      pagada
                        ? "bg-green-950/40 text-green-400"
                        : "bg-orange-950/40 text-orange-400"
                    }`}
                  >
                    {cuota.estado}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default DevicePayments;
