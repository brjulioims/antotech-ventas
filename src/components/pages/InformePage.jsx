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

const filters = [
  { id: "daily", label: "Diario" },
  { id: "monthly", label: "Mensual" },
  { id: "quarterly", label: "Trimestral" },
  { id: "yearly", label: "Anual" },
];

function getPeriodKey(date, filter) {
  const [year, month, day] = date.split("-");
  const quarter = Math.floor((Number(month) - 1) / 3) + 1;

  if (filter === "monthly") return `${year}-${month}`;
  if (filter === "quarterly") return `${year}-T${quarter}`;
  if (filter === "yearly") return year;

  return `${year}-${month}-${day}`;
}

function formatPeriodLabel(period, filter) {
  if (period === "-") return period;

  if (filter === "daily") {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${period}T00:00:00`));
  }

  if (filter === "monthly") {
    const [year, month] = period.split("-");
    return new Intl.DateTimeFormat("es-CO", {
      month: "long",
      year: "numeric",
    }).format(new Date(`${year}-${month}-01T00:00:00`));
  }

  if (filter === "quarterly") {
    const [year, quarter] = period.split("-T");
    return `Trimestre ${quarter} de ${year}`;
  }

  return period;
}

export default function InformePage({ ventas, gastos }) {
  const [activeFilter, setActiveFilter] = useState("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const selectedPeriodKey = selectedDate ? getPeriodKey(selectedDate, activeFilter) : "";

  const filteredItems = [...ventas, ...gastos].filter((item) =>
    selectedDate ? getPeriodKey(item.date, activeFilter) === selectedPeriodKey : true
  );

  const periodMap = filteredItems.reduce((acc, item) => {
    const key = getPeriodKey(item.date, activeFilter);

    if (!acc[key]) {
      acc[key] = {
        period: key,
        income: 0,
        gastos: 0,
        ventasCount: 0,
      };
    }

    if ("total" in item) {
      acc[key].income += Number(item.total);
      acc[key].ventasCount += 1;
    }

    if ("monto" in item) {
      acc[key].gastos += Number(item.monto);
    }

    return acc;
  }, {});

  const periodData = Object.values(periodMap)
    .map((period) => ({
      ...period,
      profit: period.income - period.gastos,
    }))
    .sort((a, b) => b.period.localeCompare(a.period));

  const currentPeriod = periodData[0] ?? {
    income: 0,
    gastos: 0,
    profit: 0,
    ventasCount: 0,
    period: "-",
  };

  const margin =
    currentPeriod.income > 0
      ? ((currentPeriod.profit / currentPeriod.income) * 100).toFixed(1)
      : 0;

  const filterLabel =
    filters.find((filter) => filter.id === activeFilter)?.label.toLowerCase() ??
    "diario";
  const activePeriodKey = selectedDate
    ? getPeriodKey(selectedDate, activeFilter)
    : getPeriodKey(todayKey, activeFilter);
  const currentPeriodLabel = formatPeriodLabel(activePeriodKey, activeFilter);
  const chartData = [
    {
      name: "Ingresos",
      value: currentPeriod.income,
      color: "#10b981",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      name: "Gastos",
      value: currentPeriod.gastos,
      color: "#f43f5e",
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
    {
      name: "Ganancia",
      value: currentPeriod.profit,
      color: "#2563eb",
      bg: "bg-blue-50",
      text: "text-blue-600",
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
          <p className="mb-4 text-sm font-bold uppercase text-slate-700">Fecha</p>

          <div className="mb-6 rounded-xl border border-slate-200 px-4 py-3">
            <label className="flex items-center gap-3 text-slate-500">
              <Calendar size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </label>
          </div>

          <p className="mb-4 text-sm font-bold uppercase text-slate-700">Periodo</p>

          <div className="grid grid-cols-2 gap-3">
            {filters.map((filter) => {
              const active = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            onClick={() => {
              setActiveFilter("monthly");
              setSelectedDate("");
            }}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Aplicar
          </button>
        </div>
      </Modal>

      <div className="mb-6 grid grid-cols-4 gap-6">
        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y">
          <p className="text-sm text-slate-400">Ingresos {filterLabel}s</p>
          <h3 className="text-3xl font-black text-green-600">
            {FormatoDinero(currentPeriod.income)}
          </h3>
        </Card>

        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y">
          <p className="text-sm text-slate-400">Gastos {filterLabel}s</p>
          <h3 className="text-3xl font-black text-red-600">
            {FormatoDinero(currentPeriod.gastos)}
          </h3>
        </Card>

        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y">
          <p className="text-sm text-slate-400">Ganancia {filterLabel}</p>
          <h3 className="text-3xl font-black text-blue-600">
            {FormatoDinero(currentPeriod.profit)}
          </h3>
        </Card>

        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y">
          <p className="text-sm text-slate-400">Periodo actual</p>
          <h3 className="text-3xl font-black text-emerald-600">
            {currentPeriodLabel}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Ultimo registro {filterLabel} disponible
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-3 p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-indigo-950">Resumen financiero</h2>
              <p className="mt-1 text-sm text-slate-500">
                Comparativo rapido del periodo {filterLabel} seleccionado
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              <Calendar size={16} />
              Abrir filtros
            </button>
          </div>

          <div className="h-72 rounded-3xl bg-slate-50 px-4 py-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="#dbe4f0" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                  contentStyle={{
                    border: "none",
                    borderRadius: "18px",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    padding: "10px 12px",
                  }}
                  formatter={(value) => FormatoDinero(value)}
                />
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

      <div className="mt-6">
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-indigo-950">
            Datos {filterLabel}s
          </h3>

          <div className="space-y-3">
            {periodData.map((period) => (
              <div
                key={period.period}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-slate-800">{period.period}</strong>
                  <span className="text-sm text-slate-500">
                    {period.ventasCount} ventas
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                  <p className="text-slate-600">
                    Ingresos: <strong>{FormatoDinero(period.income)}</strong>
                  </p>
                  <p className="text-slate-600">
                    Gastos: <strong>{FormatoDinero(period.gastos)}</strong>
                  </p>
                  <p className="text-slate-600">
                    Ganancia: <strong>{FormatoDinero(period.profit)}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="mb-4 font-bold text-indigo-950">Resumen</h3>

        <p className="text-slate-600">
          El margen de ganancia {filterLabel} actual es de{" "}
          <strong className="text-blue-700">{margin}%</strong>.
        </p>
      </Card>
    </section>
  );
}
