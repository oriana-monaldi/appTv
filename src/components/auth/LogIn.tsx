import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Tv, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { loginClient } from "../../services/clients";

const LogIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (email === "admin2026@gmail.com") {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
        return;
      }

      const client = await loginClient({
        email,
        password,
      });

      if (!client) {
        setError("Email o contraseña incorrectos.");
        return;
      }

      localStorage.setItem("role", "client");
      localStorage.setItem("clientId", client.id);

      navigate("/cliente/home");
    } catch {
      console.error(error);
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
            <Tv size={32} className="text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-slate-400">
            Accedé a tu panel de gestión
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default LogIn;
