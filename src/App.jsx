import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/pages/Dashboard";
import ProductosPage from "./components/pages/ProductosPage";
import VentasPage from "./components/pages/VentasPages";
import GastosPage from "./components/pages/GastosPage";
import InventarioPage from "./components/pages/InventarioPage";
import ReportsPage from "./components/pages/InformePage";
import Login from "./components/pages/auth/login";
import { initialproductos, initialventas, initialgastos } from "./components/services/data";

const pageByPath = {
  "/login": "login",
  "/dashboard": "dashboard",
  "/productos": "productos",
  "/ventas": "ventas",
  "/gastos": "gastos",
  "/inventario": "inventario",
  "/reportes": "reportes",
};

const pathByPage = {
  login: "/login",
  dashboard: "/dashboard",
  productos: "/productos",
  ventas: "/ventas",
  gastos: "/gastos",
  inventario: "/inventario",
  reportes: "/reportes",
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );
  const [activePage, setActivePage] = useState(
    () => pageByPath[window.location.pathname] ?? "dashboard"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [productos, setproductos] = useState(initialproductos);
  const [ventas, setventas] = useState(initialventas);
  const [gastos, setgastos] = useState(initialgastos);

  const estadisticas = useMemo(() => {
    const totalventas = ventas.reduce((acc, sale) => acc + Number(sale.total), 0);
    const totalgastos = gastos.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const profit = totalventas - totalgastos;
    const lowStock = productos.filter((p) => Number(p.stock) <= 5).length;

    return {
      totalventas,
      totalgastos,
      profit,
      lowStock,
      productosCount: productos.length,
    };
  }, [productos, ventas, gastos]);

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(pageByPath[window.location.pathname] ?? "dashboard");
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (window.location.pathname !== "/login") {
        window.history.replaceState({}, "", "/login");
      }
      return;
    }

    const nextPath = pathByPage[activePage] ?? "/";

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage("dashboard");
    window.history.replaceState({}, "", "/login");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActivePage("dashboard");
  };

  const pages = {
    dashboard: (
      <Dashboard
        productos={productos}
        ventas={ventas}
        gastos={gastos}
        estadisticas={estadisticas}
      />
    ),
    productos: <ProductosPage productos={productos} setproductos={setproductos} />,
    ventas: (
      <VentasPage
        productos={productos}
        setproductos={setproductos}
        ventas={ventas}
        setventas={setventas}
      />
    ),
    gastos: <GastosPage gastos={gastos} setgastos={setgastos} />,
    inventario: <InventarioPage productos={productos} />,
    reportes: <ReportsPage ventas={ventas} gastos={gastos} estadisticas={estadisticas} />,
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-transparent flex items-start">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />

      <main className="flex h-screen flex-1 flex-col overflow-hidden p-4">
        <Navbar
          activePage={activePage}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-width:none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {pages[activePage]}
        </div>
      </main>
    </div>
  );
}
