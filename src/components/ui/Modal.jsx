import { X } from "lucide-react";

export default function Modal({ open, title, subtitle, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{title}</h2>
            {subtitle ? (
              <p className="mt-2 text-sm uppercase text-slate-500">{subtitle}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-3 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
