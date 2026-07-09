import { LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ClientMenu = ({ open, onClose }: Props) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("clientId");
    localStorage.removeItem("role");

    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-800 bg-slate-900 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div>
            <h2 className="text-lg font-bold text-white">Mi cuenta</h2>
          </div>

          <button onClick={onClose}>
            <X className="text-slate-400" />
          </button>
        </div>

        <nav className="flex flex-col p-4">
          <Link
            to="/cliente/home"
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-white hover:bg-slate-800"
          >
            Inicio
          </Link>

          <Link
            to="/cliente/mis-televisores"
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-white hover:bg-slate-800"
          >
            Mis televisores
          </Link>

          <button
            onClick={logout}
            className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </nav>
      </aside>
    </>
  );
};

export default ClientMenu;
