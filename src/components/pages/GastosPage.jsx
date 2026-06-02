import { useState } from "react";
import Card from "../ui/Card";
import { FormatoDinero } from "../ui/FormatoDinero";
import Swal from "sweetalert2";
import Table from "../ui/Table";
import Guardar from "../botones/Guardar";

export default function GastosPage({ expenses, setExpenses }) {
  const [form, setForm] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.description || !form.date) {
      Swal.fire("Campos requeridos", "Completa todos los campos", "warning");
      return;
    }

    if (Number(form.amount) <= 0) {
      Swal.fire("Monto invalido", "Ingresa un monto mayor a 0", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Quieres registrar este gasto?",
      text: "Se guardará en el historial.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const newExpense = {
      id: Date.now(),
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      date: form.date,
    };

    setExpenses([...expenses, newExpense]);

    setForm({
      category: "",
      description: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    });
    Swal.fire("Se agrego con exito", "El gasto fue registrado", "success");
  };

  return (
    <section>
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-indigo-950">Registrar gasto</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="input"
              placeholder="Categoria"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />

            <input
              className="input"
              placeholder="Descripcion"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Monto"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />

            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />

            <Guardar>Guardar gasto</Guardar>
          </form>
        </Card>

        <Table
          title="Historial de gastos"
          subtitle="Control de egresos registrados"
          badge={`${expenses.length} registros`}
          className="col-span-2"
          contentClassName="overflow-hidden rounded-xl border border-slate-100"
        >
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
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3">{expense.date}</td>
                  <td className="px-4 py-3 font-medium">{expense.category}</td>
                  <td className="px-4 py-3">{expense.description}</td>
                  <td className="px-4 py-3 font-semibold text-rose-600">
                    {FormatoDinero(expense.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>
    </section>
  );
}
