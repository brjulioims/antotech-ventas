import { useState } from "react";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";

export default function InventarioPage({ productos }) {
  const [tableSearch, setTableSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const normalizedTableSearch = tableSearch.trim().toLowerCase();
  const filteredProductos = productos.filter((producto) =>
    !normalizedTableSearch ||
    producto.nombre.toLowerCase().includes(normalizedTableSearch) ||
    producto.categoria.toLowerCase().includes(normalizedTableSearch)
  );
  const totalPages = Math.max(1, Math.ceil(filteredProductos.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <section>
      <Table
        title="Inventario"
        subtitle="Disponibilidad actual por producto"
        badge={`${filteredProductos.length} productos`}
        contentClassName="overflow-hidden rounded-xl border border-slate-100"
        action={
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => {
              setTableSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar producto"
            className="w-52 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 outline-none"
          />
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Existencia</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProductos.map((producto) => (
              <tr key={producto.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-4 py-3 font-medium">{producto.nombre}</td>
                <td className="px-4 py-3">{producto.categoria}</td>
                <td className="px-4 py-3">{producto.existencias}</td>
                <td className="px-4 py-3">
                  {producto.existencias <= 0 ? (
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                      Agotado
                    </span>
                  ) : producto.existencias <= 5 ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                      Existencia baja
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                      Disponible
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls
          totalItems={filteredProductos.length}
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
    </section>
  );
}
