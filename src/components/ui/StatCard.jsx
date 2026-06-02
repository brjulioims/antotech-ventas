export default function StatCard({ title, label, value, color = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-center font-bold text-indigo-950 mb-6">{title}</h3>

      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500">{label}</span>
        <span className={`px-3 py-1 rounded-md font-bold ${colors[color]}`}>
          {value}
        </span>
      </div>
    </div>
  );
}