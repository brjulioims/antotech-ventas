export default function Table({
  title,
  subtitle,
  badge,
  children,
  className = "",
  contentClassName = "",
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-extrabold text-slate-900">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {badge ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {badge}
          </span>
        ) : null}
      </div>

      <div className={contentClassName}>{children}</div>
    </section>
  );
}
