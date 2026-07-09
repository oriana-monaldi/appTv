import { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createDeviceForClient } from "../../../services/clients";

const formatPrice = (value: string) => {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  return Number(numbers).toLocaleString("es-AR");
};

const AltaTelevisor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    serie: "",
    precioTotal: "",
    cantidadCuotas: "",
    fechaInicio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "precioTotal") {
      newValue = formatPrice(value);
    }

    setForm({
      ...form,
      [name]: newValue,
    });
  };

  const valorCuota =
    form.precioTotal && form.cantidadCuotas
      ? Math.round(
          Number(form.precioTotal.replace(/\./g, "")) /
            Number(form.cantidadCuotas),
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      alert("No se encontró el cliente.");
      return;
    }

    if (
      !form.marca ||
      !form.modelo ||
      !form.serie ||
      !form.precioTotal ||
      !form.cantidadCuotas ||
      !form.fechaInicio
    ) {
      alert("Completá todos los campos.");
      return;
    }

    if (Number(form.precioTotal.replace(/\./g, "")) <= 0) {
      alert("El precio total debe ser mayor a 0.");
      return;
    }

    if (Number(form.cantidadCuotas) <= 0) {
      alert("La cantidad de cuotas no es válida.");
      return;
    }

    try {
      setSaving(true);

      await createDeviceForClient({
        clientId: id,
        ...form,
        precioTotal: form.precioTotal.replace(/\./g, ""),
      });

      navigate(`/admin/clientes/${id}`);
    } catch (error) {
      console.error("Error agregando televisor:", error);
      alert("No se pudo agregar el televisor.");
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-xl font-bold">Agregar televisor</h1>
            <p className="text-xs text-slate-400">Cliente ID: {id}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Datos del televisor
            </h2>

            <div className="space-y-3">
              <select
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="">Seleccionar marca</option>
                <option value="Samsung">Samsung</option>
                <option value="LG">LG</option>
                <option value="TCL">TCL</option>
                <option value="Philco">Philco</option>
                <option value="Noblex">Noblex</option>
              </select>

              <input
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                type="text"
                placeholder="Modelo"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                name="serie"
                value={form.serie}
                onChange={handleChange}
                type="text"
                placeholder="N° Serie"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Suscripción
            </h2>

            <div className="space-y-3">
              <input
                name="precioTotal"
                value={form.precioTotal}
                onChange={handleChange}
                type="text"
                inputMode="numeric"
                placeholder="Precio total"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <select
                name="cantidadCuotas"
                value={form.cantidadCuotas}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="">Seleccionar cuotas</option>
                <option value="3">3 cuotas</option>
                <option value="6">6 cuotas</option>
                <option value="12">12 cuotas</option>
                <option value="18">18 cuotas</option>
              </select>

              {form.precioTotal && form.cantidadCuotas && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                  Valor de cada cuota:{" "}
                  <strong className="text-blue-400">
                    ${valorCuota.toLocaleString("es-AR")}
                  </strong>
                </div>
              )}

              <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                <input
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={handleChange}
                  type="date"
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
                <Calendar size={18} className="text-slate-500" />
              </div>
            </div>
          </section>

          <button
            disabled={saving}
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar televisor"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AltaTelevisor;
