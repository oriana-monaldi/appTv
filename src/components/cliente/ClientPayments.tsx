import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDeviceById,
  getInstallmentsByDeviceId,
} from "../../services/clients";
import type { Device, Installment } from "../../types/clients";

const formatMoney = (value: number | string) => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "0";

  return numberValue.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const ClientPayments = () => {
  const navigate = useNavigate();
  const { deviceId } = useParams();

  const [device, setDevice] = useState<Device | null>(null);
  const [cuotas, setCuotas] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      if (!deviceId) {
        setLoading(false);
        return;
      }

      try {
        const deviceData = await getDeviceById(deviceId);
        const cuotasData = await getInstallmentsByDeviceId(deviceId);

        setDevice(deviceData);
        setCuotas(cuotasData);
      } catch (error) {
        console.error("Error cargando cuotas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [deviceId]);

  const handleInstallmentClick = (cuota: Installment) => {
    if (!deviceId || cuota.estado !== "Pendiente") return;

    navigate(`/cliente/dispositivos/${deviceId}/cuotas/${cuota.id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        Cargando cuotas...
      </main>
    );
  }

  if (!device) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        Televisor no encontrado.
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
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Mis cuotas</h1>
            <p className="text-xs text-slate-400">{device.nombre}</p>
          </div>
        </header>

        <section className="space-y-3">
          {cuotas.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-center">
              <p className="text-sm text-slate-400">
                Este dispositivo todavía no tiene cuotas.
              </p>
            </div>
          )}

          {cuotas.map((cuota) => {
            const pagada = cuota.estado === "Pagada";
            const pendiente = cuota.estado === "Pendiente";

            return (
              <article
                key={cuota.id}
                role={pendiente ? "button" : undefined}
                tabIndex={pendiente ? 0 : undefined}
                onClick={() => handleInstallmentClick(cuota)}
                onKeyDown={(event) => {
                  if (
                    pendiente &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    handleInstallmentClick(cuota);
                  }
                }}
                className={`flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition ${
                  pendiente
                    ? "cursor-pointer hover:border-orange-700 hover:bg-slate-800"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      pagada
                        ? "border-green-900 bg-green-950/40 text-green-400"
                        : "border-orange-900 bg-orange-950/40 text-orange-400"
                    }`}
                  >
                    {pagada ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">Cuota {cuota.numero}</h3>
                    <p className="text-xs text-slate-500">{cuota.fecha}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      ${formatMoney(cuota.monto)}
                    </p>

                    <span
                      className={`text-xs font-bold ${
                        pagada ? "text-green-400" : "text-orange-400"
                      }`}
                    >
                      {cuota.estado}
                    </span>
                  </div>

                  {pendiente && (
                    <ChevronRight size={18} className="text-slate-500" />
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
};

export default ClientPayments;