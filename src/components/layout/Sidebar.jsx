import {
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import Swal from "sweetalert2";

const menu = [
  { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
  { id: "productos", label: "Productos", icon: ShoppingBag },
  { id: "ventas", label: "Ventas", icon: DollarSign },
  { id: "gastos", label: "Gastos", icon: Receipt },
  { id: "inventario", label: "Inventario", icon: Package },
  { id: "reportes", label: "Reportes", icon: FileText },
  { id: "logout", label:"Cerrar Sesión", icon: LogOut}
];

export default function Sidebar({
  activePage,
  setActivePage,
  isSidebarOpen,
  setIsSidebarOpen,
  onLogout,
}) {
  return (
    <aside
      className={`flex-none self-start bg-[#f5f8fd] p-3 transition-all ${
        isSidebarOpen ? "w-70" : "w-23"
      }`}
    >
      <div
        className={`flex h-[calc(100vh-24px)] flex-col rounded-2xl bg-white py-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
          isSidebarOpen ? "px-4" : "px-3"
        }`}
      >
        <div
          className={`mb-10 flex items-start ${
            isSidebarOpen ? "justify-between px-2" : "justify-center"
          }`}
        >
          {isSidebarOpen ? (
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#163a8c]">
                Antotech
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Sistema de Ventas
              </p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={async () => {
                  if (item.id === "logout") {
                    const result = await Swal.fire({
                      title: "¿Estás seguro?",
                      text: "¿Deseas cerrar tu sesión actual?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Si, cerrar sesión",
                      confirmButtonColor: "#163aaa",
                      cancelButtonText: "Cancelar",
                    });

                    if (!result.isConfirmed) return;

                    onLogout?.();
                    return;
                  }

                  setActivePage(item.id);
                }}
                className={`flex w-full items-center rounded-2xl text-left text-[15px] transition ${
                  isSidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-0 py-3"
                } ${
                  active
                    ? "bg-[#dfe6ff] font-semibold text-[#17357f]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                title={item.label}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    active ? "text-[#17357f]" : "text-slate-700"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                {isSidebarOpen ? item.label : null}
              </button>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}
