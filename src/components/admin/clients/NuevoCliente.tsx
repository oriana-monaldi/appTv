import { useState } from "react";
import { ArrowLeft, Calendar, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../layout/AdminMenu";
import { createClientWithDevice } from "../../../services/clients";

const toTitleCase = (value: string) => {
  return value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const onlyNumbers = (value: string) => {
  return value.replace(/\D/g, "");
};

const formatPrice = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";

  return Number(numbers).toLocaleString("es-AR");
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const NuevoCliente = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
    marca: "",
    modelo: "",
    serie: "",
    precioTotal: "",
    cantidadCuotas: "",
    fechaInicio: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "nombre") newValue = toTitleCase(value);
    if (name === "dni") newValue = onlyNumbers(value).slice(0, 8);
    if (name === "telefono") newValue = onlyNumbers(value);
    if (name === "direccion") newValue = value.slice(0, 50);

    if (name === "precioTotal") {
      newValue = formatPrice(value);
    }

    setForm({
      ...form,
      [name]: newValue,
    });
  };

  const precioTotalNumber = Number(form.precioTotal.replace(/\./g, ""));

  const valorCuota =
    precioTotalNumber && form.cantidadCuotas
      ? Math.round(precioTotalNumber / Number(form.cantidadCuotas))
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.dni ||
      !form.telefono ||
      !form.email ||
      !form.direccion ||
      !form.marca ||
      !form.modelo ||
      !form.serie ||
      !form.precioTotal ||
      !form.cantidadCuotas ||
      !form.fechaInicio
    ) {
      alert("Completá todos los campos antes de guardar.");
      return;
    }

    if (!/^\d+$/.test(form.dni)) {
      alert("El DNI solo puede contener números.");
      return;
    }

    if (form.dni.length > 8) {
      alert("El DNI debe tener hasta 8 números.");
      return;
    }

    if (!/^\d+$/.test(form.telefono)) {
      alert("El teléfono solo puede contener números.");
      return;
    }

    if (!isValidEmail(form.email)) {
      alert("Ingresá un correo electrónico válido.");
      return;
    }

    if (form.direccion.length > 50) {
      alert("La dirección no puede superar los 50 caracteres.");
      return;
    }

    if (precioTotalNumber <= 0) {
      alert("El precio total debe ser mayor a 0.");
      return;
    }

    if (Number(form.cantidadCuotas) <= 0) {
      alert("La cantidad de cuotas no es válida.");
      return;
    }

    try {
      setSaving(true);

      await createClientWithDevice({
        ...form,
        precioTotal: form.precioTotal.replace(/\./g, ""),
      });

      navigate("/admin/clientes");
    } catch (error) {
      console.error("Error creando cliente:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocurrió un error al guardar el cliente.");
      }
    } finally {
      setSaving(false);
    }
  };

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
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 transition hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Datos del cliente
            </h2>

            <div className="space-y-3">
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                type="text"
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                type="text"
                placeholder="DNI"
                maxLength={8}
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                type="text"
                placeholder="Teléfono"
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Correo electrónico"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                type="text"
                maxLength={50}
                placeholder="Dirección"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>
          </section>

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

              <label className="flex cursor-pointer items-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                <input
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={handleChange}
                  type="date"
                  className="w-full cursor-pointer bg-transparent text-sm text-white outline-none"
                />

                <Calendar
                  size={18}
                  className="pointer-events-none text-slate-500"
                />
              </label>
            </div>
          </section>

          <button
            disabled={saving}
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cliente"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default NuevoCliente;
