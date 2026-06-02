export default function Guardar({ children, type = "submit" }) {
  return (
    <button
      type={type}
      className="w-full rounded-lg border border-blue-600 bg-white py-3 font-bold text-blue-600"
    >
      {children}
    </button>
  );
}
