import { Link } from "react-router-dom";

type MenuProps = {
  open: boolean;
  onClose: () => void;
};

const Menu = ({ open, onClose }: MenuProps) => {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8">
          <h3 className="text-base font-bold">Panel Admin</h3>
          <p className="text-xs text-slate-300">Gestión de servicios</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            onClick={onClose}
            to="/admin/dashboard"
            className="rounded-xl px-4 py-3 text-sm hover:bg-white/10"
          >
            Dashboard
          </Link>

          <Link
            onClick={onClose}
            to="/admin/clientes"
            className="rounded-xl px-4 py-3 text-sm hover:bg-white/10"
          >
            Clientes
          </Link>

          <button className="rounded-xl px-4 py-3 text-left text-sm hover:bg-white/10">
            Televisores
          </button>

          <button className="rounded-xl px-4 py-3 text-left text-sm hover:bg-white/10">
            Suscripciones
          </button>

          <button className="rounded-xl px-4 py-3 text-left text-sm hover:bg-white/10">
            Pagos
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Menu;
