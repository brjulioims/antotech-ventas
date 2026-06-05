export default function PaginationControls({
  totalItems,
  currentPage,
  rowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 15, 20, 25],
  onRowsPerPageChange,
  onPrevious,
  onNext,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-4 text-sm text-slate-600">
      <div className="flex items-center gap-6">
        <div>
          <span className="font-semibold uppercase text-slate-500">Filas por página</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            className="ml-3 rounded-lg border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-900 outline-none"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="font-semibold">
          {startItem}-{endItem} de {totalItems}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="font-semibold uppercase text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          Anterior
        </button>
        <span className="font-semibold uppercase text-slate-500">
          Página {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage === totalPages || totalItems === 0}
          className="font-semibold uppercase text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
