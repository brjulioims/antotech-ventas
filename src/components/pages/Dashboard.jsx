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

export default function Dashboard({ productos, ventas, gastos}) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dailyVentas = ventas.filter((venta) => venta.date === todayKey);
  const dailyGastos = gastos.filter((gasto) => gasto.date === todayKey);
  const dailyventas = dailyVentas
    .reduce((acc, venta) => acc + Number(venta.total), 0);
  const dailygastos = dailyGastos
    .reduce((acc, gasto) => acc + Number(gasto.monto), 0);
  const chartData = [
    {
      name: "Ingresos",
      value: dailyventas,
      color: "#10b981",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      name: "Gastos",
      value: dailygastos,
      color: "#f43f5e",
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  ];
  const pieData =
    dailyventas || dailygastos
      ? chartData
      : [
          {
            name: "Sin movimientos",
            value: 1,
            color: "#cbd5e1",
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
                Comparativo rapido del dia {todayKey}
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
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  label={false}
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 text-center">
          <h2 className="mb-23 font-bold text-indigo-950">Productos</h2>

          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-8 border-slate-200 text-3xl font-black text-slate-700">
            {productos.length}
          </div>

          <p className="mt-6 text-sm font-semibold">Productos registrados</p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <Table
          title="Ultimas ventas"
          subtitle="Movimientos mas recientes"
          badge={`${dailyVentas.length} total`}
          contentClassName="space-y-3"
        >
          {dailyVentas.length ? (
            dailyVentas.slice(-5).reverse().map((venta) => (
              <div
                key={venta.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-800">{venta.nombredelProducto}</p>
                  <p className="text-slate-500">{venta.date}</p>
                </div>
                <strong className="text-emerald-600">{FormatoDinero(venta.total)}</strong>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              No hay ventas en el día de hoy
            </p>
          )}
        </Table>

        <Table
          title="Ultimos gastos"
          subtitle="Egresos mas recientes"
          badge={`${dailyGastos.length} total`}
          contentClassName="space-y-3"
        >
          {dailyGastos.length ? (
            dailyGastos.slice(-5).reverse().map((gasto) => (
              <div
                key={gasto.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-800">{gasto.descripcion}</p>
                  <p className="text-slate-500">{gasto.date}</p>
                </div>
                <strong className="text-rose-600">
                  {FormatoDinero(gasto.monto)}
                </strong>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              No hay gastos en el día de hoy
            </p>
          )}
        </Table>
      </div>
    </section>
  );
}
