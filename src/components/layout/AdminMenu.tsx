import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

type AdminMenuProps = {
  open: boolean;
  onClose: () => void;
};

const AdminMenu = ({ open, onClose }: AdminMenuProps) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8">
          <h3 className="text-base font-bold">Panel Admin</h3>
          <p className="text-xs text-slate-300">Gestión de servicios</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          <Link
            to="/admin/dashboard"
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-sm hover:bg-white/10"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/clientes"
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-sm hover:bg-white/10"
          >
            Clientes
          </Link>

          <div className="mt-auto border-t border-slate-800 pt-6">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminMenu;
