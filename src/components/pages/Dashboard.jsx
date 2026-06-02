import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Card from "../ui/Card";
import Table from "../ui/Table";
import { FormatoDinero } from "../ui/FormatoDinero";

export default function Dashboard({ products, sales, expenses, stats }) {
  const latestDate = [...sales.map((sale) => sale.date), ...expenses.map((expense) => expense.date)]
    .sort()
    .at(-1);
  const dailySales = sales
    .filter((sale) => sale.date === latestDate)
    .reduce((acc, sale) => acc + Number(sale.total), 0);
  const dailyExpenses = expenses
    .filter((expense) => expense.date === latestDate)
    .reduce((acc, expense) => acc + Number(expense.amount), 0);
  const chartData = [
    {
      name: "Ingresos",
      value: dailySales,
      color: "#10b981",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      name: "Gastos",
      value: dailyExpenses,
      color: "#f43f5e",
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-3 p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-indigo-950">Resumen diario</h2>
              <p className="mt-1 text-sm text-slate-500">
                Comparativo rapido del dia {latestDate ?? "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {chartData.map((item) => (
                <div key={item.name} className={`rounded-2xl px-4 py-3 ${item.bg}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.name}
                  </p>
                  <p className={`mt-2 text-sm font-bold ${item.text}`}>
                    {FormatoDinero(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-72 rounded-2xl bg-slate-50 px-4 py-5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    border: "none",
                    borderRadius: "18px",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    padding: "10px 12px",
                  }}
                  formatter={(value) => FormatoDinero(value)}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <h2 className="mb-8 font-bold text-indigo-950">Productos</h2>

          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-8 border-slate-200 text-3xl font-black text-slate-700">
            {products.length}
          </div>

          <p className="mt-6 text-sm font-semibold">Productos registrados</p>
          <p className="mt-8 text-sm text-slate-400">Stock bajo</p>
          <p className="text-xl font-bold text-green-600">↑ {stats.lowStock}</p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <Table
          title="Ultimas ventas"
          subtitle="Movimientos mas recientes"
          badge={`${sales.length} total`}
          contentClassName="space-y-3"
        >
          {sales.slice(-5).reverse().map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-800">{sale.productName}</p>
                <p className="text-slate-500">{sale.date}</p>
              </div>
              <strong className="text-emerald-600">{FormatoDinero(sale.total)}</strong>
            </div>
          ))}
        </Table>

        <Table
          title="Ultimos gastos"
          subtitle="Egresos mas recientes"
          badge={`${expenses.length} total`}
          contentClassName="space-y-3"
        >
          {expenses.slice(-5).reverse().map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-800">{expense.description}</p>
                <p className="text-slate-500">{expense.date}</p>
              </div>
              <strong className="text-rose-600">
                {FormatoDinero(expense.amount)}
              </strong>
            </div>
          ))}
        </Table>
      </div>
    </section>
  );
}
