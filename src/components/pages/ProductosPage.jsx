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
  const [productSearch, setProductSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    costo: "",
    existencias: "",
  });
  const isEditing = Boolean(editingProductId);
  const isExistingProductSelected = Boolean(selectedProductId) && !isEditing;
  const normalizedTableSearch = tableSearch.trim().toLowerCase();
  const filteredProductos = productos.filter((producto) =>
    !normalizedTableSearch ||
    producto.nombre.toLowerCase().includes(normalizedTableSearch) ||
    producto.categoria.toLowerCase().includes(normalizedTableSearch)
  );
  const capitalizeFirstLetter = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  const resetForm = () => {
    setSelectedProductId("");
    setProductSearch("");
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
        date: new Date().toISOString().slice(0, 10),
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
            {isEditing && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                Estas en modo edicion
              </div>
            )}

            <input
              className="input"
              list="productos-existentes"
              value={productSearch}
              placeholder="Buscar producto"
              onChange={(e) => {
                const nextValue = e.target.value;
                const selectedProduct = productos.find(
                  (producto) => producto.nombre === nextValue
                );

                setProductSearch(nextValue);
                setEditingProductId("");

                if (!selectedProduct) {
                  setSelectedProductId("");
                  setForm({
                    nombre: "",
                    categoria: "",
                    precio: "",
                    costo: "",
                    existencias: "",
                  });
                  return;
                }

                setSelectedProductId(String(selectedProduct.id));
                setForm({
                  nombre: selectedProduct.nombre,
                  categoria: selectedProduct.categoria,
                  precio: selectedProduct.precio,
                  costo: selectedProduct.costo,
                  existencias: "",
                });
              }}
              required
            />
            <datalist id="productos-existentes">
              {productos.map((producto) => (
                <option key={producto.id} value={producto.nombre} />
              ))}
            </datalist>

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
          badge={`${filteredProductos.length} productos`}
          className="col-span-2"
          contentClassName="overflow-hidden rounded-xl border border-slate-100"
          action={
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
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
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Costo</th>
                <th className="px-4 py-3 font-semibold">Existencia</th>
                <th className="px-4 py-3 font-semibold">Accion</th>
              </tr>
            </thead>

            <tbody>
              {filteredProductos.map((producto) => (
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
                        setProductSearch(producto.nombre);
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
