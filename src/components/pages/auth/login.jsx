import { useState } from "react";
import Card from "../../ui/Card";
import LoginParticles from "../../ui/Particles";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    onLogin?.({ username, password });

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      <LoginParticles />
      {/* Panel Izquierdo */}
      <div className="relative hidden lg:flex lg:w-[60%] bg-[#163aaa] overflow-hidden">
        {/* Efectos decorativos */}
        <div className="absolute top-20 right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-20 top-16 z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
            ANTOTECH
          </p>
          <p className="mt-1 text-xs font-black text-white uppercase tracking-[0.32em]">
            Sistema de ventas
          </p>
        </div>

        <div className="relative z-10 flex h-full items-center px-20">
          <div className="max-w-xl">
            <span className="max-w-xl text-[36px] font-extrabold leading-[0.98] tracking-tight xl:text-[46px] text-white">
              Controla tus inventario y ventas con una interfaz clara,
              rápida y elegante.
            </span>

            <p className="mt-8 text-lg leading-8 text-blue-100">
              Gestiona productos, ventas diarias y seguimiento de
              accesorios móviles desde un solo lugar, con una experiencia
              visual limpia y profesional que mantiene el estilo de tu
              sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Panel Derecho */}
      <div className="flex flex-1 items-center justify-center bg-[#f5f8fd] px-6 lg:w-[40%] lg:flex-none">
        <div className="w-full max-w-md">
          <Card className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#163aaa]/10 bg-[#f5f8fd] shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#163aaa]"
                >
                  <rect x="7" y="2" width="10" height="20" rx="2" />
                  <path d="M11 18h2" />
                  <path d="M9 6h6" />
                </svg>
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#163aaa]">
                Bienvenido(a)
              </p>
              <h3 className="mt-2 text-[30px] font-extrabold tracking-tight text-[#0e183f]">
                Inicio de sesión
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Usuario */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-[#163aaa]"
                >
                  Usuario
                </label>

                <input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#163aaa] focus:ring-2 focus:ring-[#163aaa]/20"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#163aaa]"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#163aaa] focus:ring-2 focus:ring-[#163aaa]/20"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#163aaa] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#12308f] active:scale-[0.98] disabled:opacity-60"
              >
                {loading
                  ? "Verificando acceso..."
                  : "Ingresar al sistema"}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
