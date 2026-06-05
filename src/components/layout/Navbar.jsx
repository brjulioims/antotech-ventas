import { Menu } from "lucide-react";

const pageTitles = {
  dashboard: "Panel de ventas",
  productos: "Productos",
  ventas: "Ventas",
  gastos: "Gastos",
  inventario: "Inventario",
  reportes: "Reportes",
};

export default function Navbar({ activePage, isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          {!isSidebarOpen ? (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
          ) : null}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
              Antotech
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              {pageTitles[activePage] ?? "Panel de ventas"}
            </h1>
          </div>
        </div>

      </div>
    </header>
  );
}
