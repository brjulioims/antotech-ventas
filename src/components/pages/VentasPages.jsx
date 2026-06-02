import { useState } from "react";
import Card from "../ui/Card";
import { FormatoDinero } from "../ui/FormatoDinero";
import Swal from "sweetalert2";
import Table from "../ui/Table";
import Guardar from "../botones/Guardar";

export default function VentasPage({ products, setProducts, sales, setSales }) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = products.find((p) => p.id === Number(productId));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      Swal.fire("Campo requerido", "Selecciona un producto", "warning");
      return;
    }

    if (Number(quantity) <= 0) {
      Swal.fire("Cantidad invalida", "Ingresa una cantidad mayor a 0", "warning");
      return;
    }

    if (Number(quantity) > selectedProduct.stock) {
      Swal.fire("Stock insuficiente", "No hay unidades suficientes", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Quieres registrar esta venta?",
      text: "Se guardará en el historial.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const total = selectedProduct.price * Number(quantity);

    const newSale = {
      id: Date.now(),
      productName: selectedProduct.name,
      quantity: Number(quantity),
      total,
      date: new Date().toISOString().slice(0, 10),
    };

    setSales([...sales, newSale]);

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, stock: p.stock - Number(quantity) }
          : p
      )
    );

    setProductId("");
    setQuantity(1);
    Swal.fire("Se agrego con exito", "La venta fue registrada", "success");
  };

  return (
    <section>
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-indigo-950">Nueva venta</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              className="input"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Seleccionar producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Stock: {product.stock}
                </option>
              ))}
            </select>

            <input
              className="input"
              type="number"
              min="1"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <div className="rounded-lg bg-slate-50 p-4 text-sm">
              Total:{" "}
              <strong>
                {selectedProduct
                  ? FormatoDinero(selectedProduct.price * Number(quantity))
                  : "$0"}
              </strong>
            </div>

            <Guardar>Registrar venta</Guardar>
          </form>
        </Card>

        <Table
          title="Historial de ventas"
          subtitle="Registro reciente de movimientos comerciales"
          badge={`${sales.length} registros`}
          className="col-span-2"
          contentClassName="overflow-hidden rounded-xl border border-slate-100"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Cantidad</th>
                <th className="px-4 py-3 font-semibold">Total</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3">{sale.date}</td>
                  <td className="px-4 py-3 font-medium">{sale.productName}</td>
                  <td className="px-4 py-3">{sale.quantity}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">
                    {FormatoDinero(sale.total)}
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
