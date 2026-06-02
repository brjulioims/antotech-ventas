import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/pages/Dashboard";
import ProductosPage from "./components/pages/ProductosPage";
import VentasPage from "./components/pages/VentasPages";
import GastosPage from "./components/pages/GastosPage";
import InventarioPage from "./components/pages/InventarioPage";
import ReportsPage from "./components/pages/InformePage";
import { initialProducts, initialSales, initialExpenses } from "./components/services/data";

const pageByPath = {
  "/": "dashboard",
  "/dashboard": "dashboard",
  "/productos": "products",
  "/ventas": "sales",
  "/gastos": "expenses",
  "/inventario": "inventory",
  "/informes": "reports",
};

const pathByPage = {
  dashboard: "/",
  products: "/productos",
  sales: "/ventas",
  expenses: "/gastos",
  inventory: "/inventario",
  reports: "/informes",
};

export default function App() {
  const [activePage, setActivePage] = useState(
    () => pageByPath[window.location.pathname] ?? "dashboard"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState(initialProducts);
  const [sales, setSales] = useState(initialSales);
  const [expenses, setExpenses] = useState(initialExpenses);

  const stats = useMemo(() => {
    const totalSales = sales.reduce((acc, sale) => acc + Number(sale.total), 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const profit = totalSales - totalExpenses;
    const lowStock = products.filter((p) => Number(p.stock) <= 5).length;

    return {
      totalSales,
      totalExpenses,
      profit,
      lowStock,
      productsCount: products.length,
    };
  }, [products, sales, expenses]);

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(pageByPath[window.location.pathname] ?? "dashboard");
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const nextPath = pathByPage[activePage] ?? "/";

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }, [activePage]);

  const pages = {
    dashboard: (
      <Dashboard
        products={products}
        sales={sales}
        expenses={expenses}
        stats={stats}
      />
    ),
    products: <ProductosPage products={products} setProducts={setProducts} />,
    sales: (
      <VentasPage
        products={products}
        setProducts={setProducts}
        sales={sales}
        setSales={setSales}
      />
    ),
    expenses: <GastosPage expenses={expenses} setExpenses={setExpenses} />,
    inventory: <InventarioPage products={products} />,
    reports: <ReportsPage sales={sales} expenses={expenses} stats={stats} />,
  };

  return (
    <div className="h-screen overflow-hidden bg-transparent flex items-start">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
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
