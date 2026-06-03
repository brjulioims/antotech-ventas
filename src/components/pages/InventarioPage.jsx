import Table from "../ui/Table";

export default function InventarioPage({ productos }) {
  return (
    <section>
      <Table
        title="Inventario"
        subtitle="Disponibilidad actual por producto"
        badge={`${productos.length} productos`}
        contentClassName="overflow-hidden rounded-xl border border-slate-100"
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
            {productos.map((producto) => (
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
      </Table>
    </section>
  );
}
