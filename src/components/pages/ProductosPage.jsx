import { useState } from "react";
import Card from "../ui/Card";
import { FormatoDinero } from "../ui/FormatoDinero";
import Swal from "sweetalert2";
import Table from "../ui/Table";
import Guardar from "../botones/Guardar";
import Editar from "../botones/Editar";
import Modal from "../ui/Modal";

export default function ProductosPage({ productos, setproductos }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [editingProductId, setEditingProductId] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    costo: "",
    existencias: "",
  });
  const isExistingProductSelected = Boolean(selectedProductId);
  const isEditing = Boolean(editingProductId);
  const capitalizeFirstLetter = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  const resetForm = () => {
    setSelectedProductId("");
    setEditingProductId("");
    setForm({
      nombre: "",
      categoria: "",
      precio: "",
      costo: "",
      existencias: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedProduct = productos.find((producto) => producto.id === Number(selectedProductId));

    if (!form.nombre || !form.categoria) {
      Swal.fire("Campos requeridos", "Completa nombre y categoria", "warning");
      return;
    }

    if (Number(form.precio) <= 0 || Number(form.costo) <= 0 || Number(form.existencias) < 0) {
      Swal.fire("Datos invalidos", "Revisa precio, costo y existencias", "warning");
      return;
    }

    const result = await Swal.fire({
      title: isEditing ? "¿Quieres editar este producto?" : "¿Quieres agregar este producto?",
      text: isEditing ? "Se actualizará en el inventario." : "Se guardará en el inventario.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isEditing ? "Si, editar" : "Si, guardar",
      confirmButtonColor: "#163aaa",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    if (isEditing) {
      setproductos(
        productos.map((producto) =>
          producto.id === Number(editingProductId)
            ? {
                ...producto,
                nombre: form.nombre,
                categoria: form.categoria,
                precio: Number(form.precio),
                costo: Number(form.costo),
                existencias: Number(form.existencias),
              }
            : producto
        )
      );
    } else if (selectedProduct) {
      setproductos(
        productos.map((producto) =>
          producto.id === selectedProduct.id
            ? {
                ...producto,
                nombre: form.nombre,
                categoria: form.categoria,
                precio: Number(form.precio),
                costo: Number(form.costo),
                existencias: producto.existencias + Number(form.existencias),
              }
            : producto
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        nombre: form.nombre,
        categoria: form.categoria,
        precio: Number(form.precio),
        costo: Number(form.costo),
        existencias: Number(form.existencias),
      };

      setproductos([...productos, newProduct]);
      setIsCreateModalOpen(false);
    }

    resetForm();
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      text: "El producto fue registrado",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  return (
    <section>
      <Modal
        open={isCreateModalOpen}
        title="Agregar producto"
        subtitle="Registro de producto nuevo"
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
      >
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="input"
              placeholder="Nombre del producto"
              value={form.nombre}
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre: capitalizeFirstLetter(e.target.value),
                })
              }
              required
            />

            <input
              className="input"
              placeholder="Categoria"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: capitalizeFirstLetter(e.target.value) })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Precio de venta"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Costo"
              value={form.costo}
              onChange={(e) => setForm({ ...form, costo: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Existencias"
              value={form.existencias}
              onChange={(e) => setForm({ ...form, existencias: e.target.value })}
              required
            />

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <Guardar>Guardar producto</Guardar>
            </div>
          </form>
        </div>
      </Modal>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-bold text-indigo-950">Agregar producto</h3>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              className="rounded-xl bg-[#163aaa] px-4 py-2 text-sm font-semibold text-white"
            >
              Nuevo producto
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              className="input"
              value={selectedProductId}
              onChange={(e) => {
                const nextId = e.target.value;
                const selectedProduct = productos.find(
                  (producto) => producto.id === Number(nextId)
                );

                setSelectedProductId(nextId);
                setEditingProductId("");

                if (!selectedProduct) {
                  resetForm();
                  return;
                }

                setForm({
                  nombre: selectedProduct.nombre,
                  categoria: selectedProduct.categoria,
                  precio: selectedProduct.precio,
                  costo: selectedProduct.costo,
                  existencias: "",
                });
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
              placeholder="Nombre del producto"
              value={form.nombre}
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre: capitalizeFirstLetter(e.target.value),
                })
              }
              disabled={isExistingProductSelected}
              required
            />

            <input
              className="input"
              placeholder="Categoria"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: capitalizeFirstLetter(e.target.value) })}
              disabled={isExistingProductSelected}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Precio de venta"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Costo"
              value={form.costo}
              onChange={(e) => setForm({ ...form, costo: e.target.value })}
              required
            />

            <input
              className="input"
              type="number"
              placeholder="Existencias"
              value={form.existencias}
              onChange={(e) => setForm({ ...form, existencias: e.target.value })}
              required
            />

            <Guardar>{isEditing ? "Guardar cambios" : "Guardar producto"}</Guardar>
          </form>
        </Card>

        <Table
          title="Lista de productos"
          subtitle="Catalogo actual del negocio"
          badge={`${productos.length} productos`}
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
                <th className="px-4 py-3 font-semibold">Existencia</th>
                <th className="px-4 py-3 font-semibold">Accion</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3 font-medium">{producto.nombre}</td>
                  <td className="px-4 py-3">{producto.categoria}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {FormatoDinero(producto.precio)}
                  </td>
                  <td className="px-4 py-3">{FormatoDinero(producto.costo)}</td>
                  <td className="px-4 py-3">{producto.existencias}</td>
                  <td className="px-4 py-3">
                    <Editar
                      onClick={() => {
                        setSelectedProductId(String(producto.id));
                        setEditingProductId(String(producto.id));
                        setForm({
                          nombre: producto.nombre,
                          categoria: producto.categoria,
                          precio: producto.precio,
                          costo: producto.costo,
                          existencias: producto.existencias,
                        });
                      }}
                    />
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
