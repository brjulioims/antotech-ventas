import { useState } from "react";
import Card from "../ui/Card";
import { FormatoDinero } from "../ui/FormatoDinero";
import Swal from "sweetalert2";
import Table from "../ui/Table";
import Guardar from "../botones/Guardar";

export default function ProductosPage({ products, setProducts }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category) {
      Swal.fire("Campos requeridos", "Completa nombre y categoria", "warning");
      return;
    }

    if (Number(form.price) <= 0 || Number(form.cost) <= 0 || Number(form.stock) < 0) {
      Swal.fire("Datos invalidos", "Revisa precio, costo y stock", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Quieres agregar este producto?",
      text: "Se guardará en el inventario.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const newProduct = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
    };

    setProducts([...products, newProduct]);

    setForm({
      name: "",
      category: "",
      price: "",
      cost: "",
      stock: "",
    });
    Swal.fire("Se agrego con exito", "El producto fue registrado", "success");
  };

  return (
    <section>
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-indigo-950">Agregar producto</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="input"
              placeholder="Nombre del producto"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="input"
              placeholder="Categoria"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Precio de venta"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Costo"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Stock inicial"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />

            <Guardar>Guardar producto</Guardar>
          </form>
        </Card>

        <Table
          title="Lista de productos"
          subtitle="Catalogo actual del negocio"
          badge={`${products.length} productos`}
          className="col-span-2"
          contentClassName="overflow-hidden rounded-xl border border-slate-100"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Costo</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {FormatoDinero(product.price)}
                  </td>
                  <td className="px-4 py-3">{FormatoDinero(product.cost)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>
    </section>
  );
}
