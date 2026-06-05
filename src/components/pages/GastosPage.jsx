import { useState } from "react";
import { Calendar } from "lucide-react";
import Card from "../ui/Card";
import { FormatoDinero } from "../ui/FormatoDinero";
import Swal from "sweetalert2";
import Table from "../ui/Table";
import Guardar from "../botones/Guardar";
import Modal from "../ui/Modal";
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
    return { startDate: format(today), endDate: format(today) };
  }

  if (period === "week") {
    const firstDay = new Date(today);
    const day = today.getDay() || 7;
    firstDay.setDate(today.getDate() - day + 1);

    return { startDate: format(firstDay), endDate: format(today) };
  }

  if (period === "month") {
    return {
      startDate: format(new Date(year, month, 1)),
      endDate: format(today),
    };
  }

  if (period === "quarter") {
    const firstMonth = (getQuarter(today) - 1) * 3;

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

  return { startDate: "", endDate: "" };
}

export default function GastosPage({ gastos, setgastos }) {
  const initialRange = getDateRangeByPeriod("today");
  const [form, setForm] = useState({
    categoria: "",
    descripcion: "",
    monto: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [activeFilter, setActiveFilter] = useState("today");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);

  const capitalizeFirstLetter = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  const handlePeriodChange = (period) => {
    setActiveFilter(period);

    if (period !== "custom") {
      const range = getDateRangeByPeriod(period);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }

    setPage(1);
  };

  const filteredGastos = gastos.filter((gasto) =>
    startDate || endDate
      ? (!startDate || gasto.date >= startDate) &&
        (!endDate || gasto.date <= endDate)
      : true
  );
  const totalPages = Math.max(1, Math.ceil(filteredGastos.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedGastos = filteredGastos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
      <Modal
        open={isModalOpen}
        title="FILTROS"
        subtitle="Filtra fechas del historial"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="px-6 py-6">
          <p className="mb-4 text-sm font-bold uppercase text-slate-700">Periodo</p>

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
                  setPage(1);
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
                  setPage(1);
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
              const range = getDateRangeByPeriod("today");
              setActiveFilter("today");
              setStartDate(range.startDate);
              setEndDate(range.endDate);
              setPage(1);
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
          badge={`${filteredGastos.length} registros`}
          className="col-span-2"
          contentClassName="overflow-hidden rounded-xl border border-slate-100"
          action={
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Abrir filtros
            </button>
          }
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
                <td className="px-4 py-3 ">Totales</td>
                <td className="px-4 py-3 font-semibold"></td>
                <td className="px-4 py-3 font-semibold"></td>
                <td className="px-4 py-3 font-semibold text-rose-600">
                  {FormatoDinero(
                    filteredGastos.reduce((total, gasto) => total + gasto.monto, 0)
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
          <PaginationControls
            totalItems={filteredGastos.length}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(value) => {
              setRowsPerPage(value);
              setPage(1);
            }}
            onPrevious={() => setPage(Math.max(1, currentPage - 1))}
            onNext={() => setPage(Math.min(totalPages, currentPage + 1))}
          />
        </Table>
      </div>
    </section>
  );
}
