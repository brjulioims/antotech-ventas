import { SquarePen } from "lucide-react";

export default function Editar({
  onClick,
  className = "",
  type = "button",
  title = "Editar",
  children,
  Icon = SquarePen,
  "aria-label": ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel ?? title}
      className={`inline-flex h-8 w-9 items-center justify-center rounded-lg
            border border-slate-200 text-slate-700
            transition-all duration-300 ease-out
            hover:shadow-sm hover:-translate-y-px
            active:scale-95${className}`}
      {...props}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}
