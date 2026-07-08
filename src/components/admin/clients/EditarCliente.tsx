import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById, updateClient } from "../../../services/clients";

const EditarCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;

      try {
        const client = await getClientById(id);

        if (client) {
          setForm({
            nombre: client.nombre || "",
            dni: client.dni || "",
            telefono: client.telefono || "",
            email: client.email || "",
            direccion: client.direccion || "",
          });
        }
      } catch (error) {
        console.error("Error cargando cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (
      !form.nombre ||
      !form.dni ||
      !form.telefono ||
      !form.email ||
      !form.direccion
    ) {
      alert("Completá todos los campos.");
      return;
    }

    try {
      setSaving(true);

      await updateClient({
        clientId: id,
        ...form,
      });

      navigate(`/admin/clientes/${id}`);
    } catch (error) {
      console.error("Error editando cliente:", error);
      alert("No se pudo editar el cliente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white">
        <p className="text-sm text-slate-400">Cargando cliente...</p>
      </main>
    );
  }

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
            <h1 className="text-xl font-bold">Editar cliente</h1>
            <p className="text-xs text-slate-400">Cliente ID: {id}</p>
          </div>
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
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                type="text"
                placeholder="Teléfono"
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
                placeholder="Dirección"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>
          </section>

          <button
            disabled={saving}
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default EditarCliente;
