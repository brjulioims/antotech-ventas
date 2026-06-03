import { useState } from "react";
import Card from "../ui/Card";
import { FormatoDinero } from "../ui/FormatoDinero";
import Swal from "sweetalert2";
import Table from "../ui/Table";
import Guardar from "../botones/Guardar";

export default function GastosPage({ gastos, setgastos }) {
  const [form, setForm] = useState({
    categoria: "",
    descripcion: "",
    monto: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const capitalizeFirstLetter = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoria || !form.descripcion || !form.date) {
      Swal.fire("Campos requeridos", "Completa todos los campos", "warning");
      return;
    }

    if (Number(form.monto) <= 0) {
      Swal.fire("Monto invalido", "Ingresa un monto mayor a 0", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Quieres registrar este gasto?",
      text: "Se guardará en el historial.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, guardar",
      confirmButtonColor: "#163aaa",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const newgastos = {
      id: Date.now(),
      categoria: form.categoria,
      descripcion: form.descripcion,
      monto: Number(form.monto),
      date: form.date,
    };

    setgastos([...gastos, newgastos]);

    setForm({
      categoria: "",
      descripcion: "",
      monto: "",
      date: new Date().toISOString().slice(0, 10),
    });
      Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      text: "El gasto fue registrado",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
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
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: capitalizeFirstLetter(e.target.value) })}
              required
            />

            <input
              className="input"
              placeholder="Descripcion"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: capitalizeFirstLetter(e.target.value) })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Monto"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
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
          badge={`${gastos.length} registros`}
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
              {gastos.map((gasto) => (
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
                <td className="px-4 py-3 ">Totales</td>
                <td className="px-4 py-3 font-semibold"></td>
                <td className="px-4 py-3 font-semibold"></td>
                <td className="px-4 py-3 font-semibold text-rose-600">
                  {FormatoDinero(
                    gastos.reduce((total, gasto) => total + gasto.monto, 0)
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </Table>
      </div>
    </section>
  );
}
