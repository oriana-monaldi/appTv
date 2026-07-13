import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Check,
  Copy,
  MessageCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getClientById,
  getDeviceById,
  getInstallmentsByDeviceId,
} from "../../services/clients";

import type { Client, Device, Installment } from "../../types/clients";

const BANK_DATA = {
  cbu: "0000003100019658033977",

  alias: "anual.donar.borde.mp",

  titular: "Facundo Nicolas Aiello",

  whatsapp: "+5491152498218",
};

const formatMoney = (value: number | string) => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "0";

  return numberValue.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const InstallmentPayment = () => {
  const navigate = useNavigate();
  const { deviceId, installmentId } = useParams();

  const [device, setDevice] = useState<Device | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [installment, setInstallment] = useState<Installment | null>(null);

  const [loading, setLoading] = useState(true);

  const [copiedField, setCopiedField] = useState<"cbu" | "alias" | null>(null);

  useEffect(() => {
    const loadPaymentInformation = async () => {
      if (!deviceId || !installmentId) {
        setLoading(false);
        return;
      }

      try {
        const [deviceData, installmentsData] = await Promise.all([
          getDeviceById(deviceId),
          getInstallmentsByDeviceId(deviceId),
        ]);

        if (!deviceData) {
          setLoading(false);
          return;
        }

        const selectedInstallment =
          installmentsData.find((item) => item.id === installmentId) ?? null;

        setDevice(deviceData);
        setInstallment(selectedInstallment);

        if (deviceData.clientId) {
          const clientData = await getClientById(deviceData.clientId);

          setClient(clientData);
        }
      } catch (error) {
        console.error("Error cargando información del pago:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentInformation();
  }, [deviceId, installmentId]);

  const copyToClipboard = async (value: string, field: "cbu" | "alias") => {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      console.error("No se pudo copiar:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        Cargando información del pago...
      </main>
    );
  }

  if (!device || !installment) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        <section className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-center">
            <h1 className="text-lg font-bold">No se encontró la cuota</h1>

            <p className="mt-2 text-sm text-slate-400">
              No pudimos encontrar la información de la cuota seleccionada.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        <section className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="rounded-2xl border border-orange-900 bg-orange-950/30 p-6 text-center">
            <h1 className="text-lg font-bold">Titular no encontrado</h1>

            <p className="mt-2 text-sm text-slate-400">
              El dispositivo no tiene un cliente asociado o no se pudieron
              cargar sus datos.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (installment.estado !== "Pendiente") {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-5 text-white">
        <section className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="rounded-2xl border border-green-900 bg-green-950/30 p-6 text-center">
            <Check className="mx-auto mb-3 text-green-400" size={36} />

            <h1 className="text-lg font-bold">Esta cuota ya está pagada</h1>

            <p className="mt-2 text-sm text-slate-400">
              No es necesario que realices nuevamente el pago.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hola, adjunto el comprobante de pago.

DATOS DEL TITULAR

Nombre y apellido: ${client.nombre}
DNI: ${client.dni}

DATOS DEL PAGO

Cuota: ${installment.numero}
Dispositivo: ${device.nombre}
Monto abonado: $${formatMoney(installment.monto)}

Por favor, confirmar cuando el pago haya sido verificado.

Muchas gracias.`,
  );

  const whatsappUrl =
    `https://wa.me/${BANK_DATA.whatsapp}` + `?text=${whatsappMessage}`;

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
            <h1 className="text-xl font-bold">Pagar cuota</h1>

            <p className="text-xs text-slate-400">{device.nombre}</p>
          </div>
        </header>

        <section className="mb-4 rounded-3xl border border-orange-900/70 bg-orange-950/30 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
            <Banknote size={26} />
          </div>

          <p className="text-sm text-slate-400">
            Monto correspondiente a la cuota {installment.numero}
          </p>

          <p className="mt-2 text-3xl font-black">
            ${formatMoney(installment.monto)}
          </p>

          <span className="mt-3 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
            Pendiente
          </span>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4 min-[360px]:p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
              <Building2 size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold">Datos para transferir</h2>

              <p className="text-xs text-slate-400">
                Transferí el monto exacto de la cuota
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* CBU */}
            <div className="rounded-2xl bg-slate-950 p-3 min-[360px]:p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                CBU
              </p>

              <div className="flex min-w-0 items-center justify-between gap-2">
                <p className="min-w-0 flex-1 font-mono text-[16px] font-bold tracking-tight text-white leading-none">
                  {BANK_DATA.cbu}
                </p>

                <button
                  type="button"
                  onClick={() => copyToClipboard(BANK_DATA.cbu, "cbu")}
                  className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition ${
                    copiedField === "cbu"
                      ? "bg-green-600 text-white"
                      : "bg-slate-800 text-s-300 hover:bg-slate-700"
                  }`}
                >
                  {copiedField === "cbu" ? (
                    <>
                      <Check size={15} />
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Alias */}
            <div className="rounded-2xl bg-slate-950 p-3 min-[360px]:p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                Alias
              </p>

              <div className="flex min-w-0 items-center justify-between gap-2">
                <p className="min-w-0 flex-1 text-[16px] font-bold tracking-tight text-white leading-none">
                  {BANK_DATA.alias}
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(BANK_DATA.alias, "alias")}
                  className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition ${
                    copiedField === "alias"
                      ? "bg-green-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  aria-label="Copiar alias"
                >
                  {copiedField === "alias" ? (
                    <>
                      <Check size={15} />
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Titular */}
            <div className="rounded-2xl bg-slate-950 p-3 min-[360px]:p-4">
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                Titular de la cuenta
              </p>

              <p className="text-sm font-bold">{BANK_DATA.titular}</p>
            </div>
          </div>
        </section>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm leading-6 text-slate-400">
            Una vez realizada la transferencia, presioná el botón de WhatsApp y
            adjuntá la imagen del comprobante.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-green-500"
        >
          <MessageCircle size={21} />
          Enviar comprobante por WhatsApp
        </a>
      </section>
    </main>
  );
};

export default InstallmentPayment;
