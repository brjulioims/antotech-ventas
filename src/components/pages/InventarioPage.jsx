import Table from "../ui/Table";

export default function InventarioPage({ products }) {
  return (
    <section>
      <Table
        title="Inventario"
        subtitle="Disponibilidad actual por producto"
        badge={`${products.length} productos`}
        contentClassName="overflow-hidden rounded-xl border border-slate-100"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  {product.stock <= 0 ? (
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                      Agotado
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                      Stock bajo
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
