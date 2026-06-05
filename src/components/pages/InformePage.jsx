import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import { FormatoDinero } from "../ui/FormatoDinero";
import PaginationControls from "../ui/PaginationControls";

const CALENDAR_PERIOD_OPTIONS = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
  { value: "quarter", label: "Este trimestre" },
  { value: "year", label: "Este año" },
  { value: "custom", label: "Personalizado" },
];


function getQuarter(date) {
  return Math.floor(date.getMonth() / 3) + 1;
}

function getDateRangeByPeriod(period) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const format = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  if (period === "today") {
    return {
      startDate: format(today),
      endDate: format(today),
    };
  }

  if (period === "week") {
    const firstDay = new Date(today);
    const day = today.getDay() || 7;
    firstDay.setDate(today.getDate() - day + 1);

    return {
      startDate: format(firstDay),
      endDate: format(today),
    };
  }

  if (period === "month") {
    return {
      startDate: format(new Date(year, month, 1)),
      endDate: format(today),
    };
  }

  if (period === "quarter") {
    const quarter = getQuarter(today);
    const firstMonth = (quarter - 1) * 3;

    return {
      startDate: format(new Date(year, firstMonth, 1)),
      endDate: format(today),
    };
  }

  if (period === "year") {
    return {
      startDate: format(new Date(year, 0, 1)),
      endDate: format(today),
    };
  }

  return {
    startDate: "",
    endDate: "",
  };
}

function getPeriodLabel(period) {
  return (
    CALENDAR_PERIOD_OPTIONS.find((option) => option.value === period)?.label ??
    "Este mes"
  );
}

export default function InformePage({ ventas, gastos }) {
  const [activeFilter, setActiveFilter] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventasPage, setVentasPage] = useState(1);
  const [gastosPage, setGastosPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const initialRange = getDateRangeByPeriod("month");

  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);

  const handlePeriodChange = (period) => {
    setActiveFilter(period);

    if (period !== "custom") {
      const range = getDateRangeByPeriod(period);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }

    setVentasPage(1);
    setGastosPage(1);
  };

  const filteredItems = [...ventas, ...gastos].filter((item) =>
    startDate || endDate
      ? (!startDate || item.date >= startDate) &&
        (!endDate || item.date <= endDate)
      : true
  );
  const filteredVentas = filteredItems.filter((item) => "total" in item);
  const filteredGastos = filteredItems.filter((item) => "monto" in item);
  const totalVentasPages = Math.max(1, Math.ceil(filteredVentas.length / rowsPerPage));
  const currentVentasPage = Math.min(ventasPage, totalVentasPages);
  const paginatedVentas = filteredVentas.slice(
    (currentVentasPage - 1) * rowsPerPage,
    currentVentasPage * rowsPerPage
  );
  const totalGastosPages = Math.max(1, Math.ceil(filteredGastos.length / rowsPerPage));
  const currentGastosPage = Math.min(gastosPage, totalGastosPages);
  const paginatedGastos = filteredGastos.slice(
    (currentGastosPage - 1) * rowsPerPage,
    currentGastosPage * rowsPerPage
  );

  const totals = filteredItems.reduce(
    (acc, item) => {
      if ("total" in item) {
        acc.income += Number(item.total);
        acc.ventasCount += 1;
      }

      if ("monto" in item) {
        acc.gastos += Number(item.monto);
      }

      return acc;
    },
    {
      income: 0,
      gastos: 0,
      ventasCount: 0,
    }
  );

  const currentPeriod = {
    income: totals.income,
    gastos: totals.gastos,
    profit: totals.income - totals.gastos,
    ventasCount: totals.ventasCount,
  };

  const margin =
    currentPeriod.income > 0
      ? ((currentPeriod.profit / currentPeriod.income) * 100).toFixed(1)
      : 0;

  const currentPeriodLabel =
    activeFilter === "custom"
      ? `${startDate || "-"} - ${endDate || "-"}`
      : getPeriodLabel(activeFilter);

  const chartData = [
    {
      name: "Ingresos",
      value: currentPeriod.income,
      color: "#10b981",
    },
    {
      name: "Gastos",
      value: currentPeriod.gastos,
      color: "#f43f5e",
    },
    {
      name: "Ganancia",
      value: currentPeriod.profit,
      color: currentPeriod.profit < 0 ? "#dc2626" : "#2563eb",
    },
  ];

  return (
    <section>
      <Modal
        open={isModalOpen}
        title="FILTROS"
        subtitle="Filtra fechas del informe"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="px-6 py-6">
          <p className="mb-4 text-sm font-bold uppercase text-slate-700">
            Periodo
          </p>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {CALENDAR_PERIOD_OPTIONS.map((option) => {
              const active = activeFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePeriodChange(option.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-[#163aaa] bg-[#163aaa] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="mb-4 text-sm font-bold uppercase text-slate-700">
            Selecciona un rango
          </p>
            <span className="text-sm font-semibold text-slate-700">Desde</span>
          <div className="mb-3 rounded-xl border border-slate-200 px-4 py-3">
            <label className="flex items-center gap-3 text-slate-500">
              <Calendar size={18} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setActiveFilter("custom");
                  setStartDate(e.target.value);
                  setVentasPage(1);
                  setGastosPage(1);
                }}
                className="w-full bg-transparent outline-none"
              />
            </label>
          </div>
          <span className="text-sm font-semibold text-slate-700">Hasta</span>
          <div className="rounded-xl border border-slate-200 px-4 py-3">
            <label className="flex items-center gap-3 text-slate-500">
              <Calendar size={18} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setActiveFilter("custom");
                  setEndDate(e.target.value);
                  setVentasPage(1);
                  setGastosPage(1);
                }}
                className="w-full bg-transparent outline-none"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            onClick={() => {
              const range = getDateRangeByPeriod("month");
              setActiveFilter("month");
              setStartDate(range.startDate);
              setEndDate(range.endDate);
              setVentasPage(1);
              setGastosPage(1);
            }}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600"
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded-xl bg-[#163aaa] px-5 py-3 font-semibold text-white"
          >
            Aplicar
          </button>
        </div>
      </Modal>

      <div className="mb-6 grid grid-cols-4 gap-6">
        <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow cursor-pointer">
          <p className="text-sm text-slate-400">Ingresos</p>
          <h3 className="text-3xl font-black text-green-600">
            {FormatoDinero(currentPeriod.income)}
          </h3>
        </Card>

        <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow cursor-pointer">
          <p className="text-sm text-slate-400">Gastos</p>
          <h3 className="text-3xl font-black text-red-600">
            {FormatoDinero(currentPeriod.gastos)}
          </h3>
        </Card>

        <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadowcursor-pointer">
          <p className="text-sm text-slate-400">Ganancia</p>
          <h3
            className={`text-3xl font-black ${
              currentPeriod.profit < 0 ? "text-red-600" : "text-blue-600"
            }`}
          >
            {FormatoDinero(currentPeriod.profit)}
          </h3>
        </Card>

        <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow cursor-pointer">
          <p className="text-sm text-slate-400">Periodo actual</p>
          <h3 className="text-2xl font-black text-[#163aaa]">
            {currentPeriodLabel}
          </h3>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-3 p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-indigo-950">
                Resumen financiero
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Comparativo rápido del periodo seleccionado
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#163aaa] px-4 py-2 text-sm font-semibold text-white"
            >
              <Calendar size={16} />
              Abrir filtros
            </button>
          </div>

          <div className="h-72 rounded-3xl bg-slate-50 px-4 py-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  stroke="#dbe4f0"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <Tooltip formatter={(value) => FormatoDinero(value)} />
                <Bar dataKey="value" radius={[14, 14, 0, 0]} barSize={56}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-slate-400">Ventas registradas</p>
          <h3 className="text-3xl font-black text-rose-600">
            {currentPeriod.ventasCount}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Conteo del periodo seleccionado
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="mb-4 font-bold text-indigo-950">Resumen</h3>

        <p className="text-slate-600">
          El margen de ganancia actual es de{" "}
          <strong className="text-blue-700">{margin}%</strong>.
        </p>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-indigo-950">Historial de ventas</h3>
              <p className="mt-1 text-sm text-slate-500">
                Movimientos del periodo filtrado
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredVentas.length} ventas
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Cantidad</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVentas.map((venta) => (
                  <tr key={venta.id} className="border-t border-slate-100 text-slate-700">
                    <td className="px-4 py-3">{venta.date}</td>
                    <td className="px-4 py-3 font-medium">{venta.nombredelProducto}</td>
                    <td className="px-4 py-3">{venta.cantidad}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      {FormatoDinero(venta.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                  <td className="px-4 py-3" colSpan={2}>
                    Totales
                  </td>
                  <td className="px-4 py-3">
                    {filteredVentas.reduce((acc, venta) => acc + venta.cantidad, 0)}
                  </td>
                  <td className="px-4 py-3 text-emerald-600">
                    {FormatoDinero(
                      filteredVentas.reduce((acc, venta) => acc + venta.total, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
            <PaginationControls
              totalItems={filteredVentas.length}
              currentPage={currentVentasPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(value) => {
                setRowsPerPage(value);
                setVentasPage(1);
              }}
              onPrevious={() => setVentasPage(Math.max(1, currentVentasPage - 1))}
              onNext={() => setVentasPage(Math.min(totalVentasPages, currentVentasPage + 1))}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-indigo-950">Historial de gastos</h3>
              <p className="mt-1 text-sm text-slate-500">
                Egresos del periodo filtrado
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredGastos.length} registros
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Descripcion</th>
                  <th className="px-4 py-3 font-semibold">Monto</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGastos.map((gasto) => (
                  <tr key={gasto.id} className="border-t border-slate-100 text-slate-700">
                    <td className="px-4 py-3">{gasto.date}</td>
                    <td className="px-4 py-3 font-medium">{gasto.categoria}</td>
                    <td className="px-4 py-3">{gasto.descripcion}</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">
                      {FormatoDinero(gasto.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                  <td className="px-4 py-3">Totales</td>
                  <td className="px-4 py-3 font-semibold"></td>
                  <td className="px-4 py-3 font-semibold"></td>
                  <td className="px-4 py-3 font-semibold text-rose-600">
                    {FormatoDinero(
                      filteredGastos.reduce((acc, gasto) => acc + gasto.monto, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
            <PaginationControls
              totalItems={filteredGastos.length}
              currentPage={currentGastosPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(value) => {
                setRowsPerPage(value);
                setGastosPage(1);
              }}
              onPrevious={() => setGastosPage(Math.max(1, currentGastosPage - 1))}
              onNext={() => setGastosPage(Math.min(totalGastosPages, currentGastosPage + 1))}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
