import { useState } from "react";
import Card from "../ui/Card";
import { FormatoDinero } from "../ui/FormatoDinero";
import Swal from "sweetalert2";
import Table from "../ui/Table";
import Guardar from "../botones/Guardar";

export default function VentasPage({ productos, setproductos, ventas, setventas, }) {
  const [productId, setProductId] = useState("");
  const [cantidad, setcantidad] = useState(1);
  const [precio, setPrecio] = useState("");

  const selectedProduct = productos.find((p) => p.id === Number(productId));

  const totalCantidad = ventas.reduce(
    (acc, venta) => acc + venta.cantidad,
    0
  );

  const totalVentas = ventas.reduce(
    (acc, venta) => acc + venta.total,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      Swal.fire("Campo requerido", "Selecciona un producto", "warning");
      return;
    }

    if (Number(cantidad) <= 0) {
      Swal.fire("Cantidad invalida", "Ingresa una cantidad mayor a 0", "warning");
      return;
    }

    if (Number(cantidad) > selectedProduct.existencias) {
      Swal.fire({
        title: selectedProduct.nombre,
        text: `No hay unidades suficientes. Disponibles: ${selectedProduct.existencias}`,
        icon: "error",
      });
      return;
    }

    if (Number(precio) <= 0) {
      Swal.fire("Precio invalido", "Ingresa un precio mayor a 0", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Quieres registrar esta venta?",
      text: "Se guardará en el historial.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, guardar",
      confirmButtonColor: "#163aaa",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const total = Number(precio) * Number(cantidad);

    const newventa = {
      id: Date.now(),
      nombredelProducto: selectedProduct.nombre,
      cantidad: Number(cantidad),
      total,
      date: new Date().toISOString().slice(0, 10),
    };

    setventas([...ventas, newventa]);

    setproductos(
      productos.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, existencias: p.existencias - Number(cantidad) }
          : p
      )
    );

    setProductId("");
    setcantidad(1);
    setPrecio("");
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      text: "La venta fue registrada",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
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
              onChange={(e) => {
                const nextId = e.target.value;
                setProductId(nextId);

                const producto = productos.find((p) => p.id === Number(nextId));
                setPrecio(producto ? producto.precio : "");
              }}
              required
            >
              <option value="">Seleccionar producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>

            <input
              className="input"
              type="number"
              min="1"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setcantidad(e.target.value)}
              required
            />

            <input
              className="input"
              type="number"
              min="1"
              placeholder="Precio de venta"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />

            <div className="rounded-lg bg-slate-50 p-4 text-sm">
              Total:{" "}
              <strong>
                {selectedProduct && precio
                  ? FormatoDinero(Number(precio) * Number(cantidad))
                  : "$0"}
              </strong>
            </div>

            <Guardar>Registrar venta</Guardar>
          </form>
        </Card>

          <Table
            title="Historial de ventas"
            subtitle="Registro reciente de movimientos comerciales"
            badge={`${ventas.length} Ventas`}
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
              {ventas.map((venta) => (
                <tr key={venta.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3">{venta.date}</td>
                  <td className="px-4 py-3 font-medium">{venta.nombredelProducto}</td>
                  <td className="px-4 py-3">{venta.cantidad}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">
                    {FormatoDinero(venta.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                <td className="px-4 py-3" colSpan={2}>
                  Totales
                </td>
                <td className="px-4 py-3">
                  {totalCantidad}
                </td>
                <td className="px-4 py-3 text-emerald-600">
                  {FormatoDinero(totalVentas)}
                </td>
              </tr>
            </tfoot>
          </table>
        </Table>
      </div>
    </section>
  );
}
