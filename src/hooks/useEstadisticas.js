import { useMemo } from "react";

export default function useEstadisticas(productos, ventas, gastos) {
  return useMemo(() => {
    const totalventas = ventas.reduce((acc, sale) => acc + Number(sale.total), 0);
    const totalgastos = gastos.reduce((acc, expense) => acc + Number(expense.monto), 0);
    const profit = totalventas - totalgastos;
    const lowStock = productos.filter((p) => Number(p.existencias) <= 5).length;

    return {
      totalventas,
      totalgastos,
      profit,
      lowStock,
      productosCount: productos.length,
    };
  }, [productos, ventas, gastos]);
}
