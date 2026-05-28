type EmptyStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  title = "Sin resultados",
  message = "No hay informacion para mostrar con los filtros actuales.",
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl bg-white shadow-sm px-6 py-16 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4.586a1 1 0 00-.697.279l-.532.532A1 1 0 0113.586 14H10.414a1 1 0 00-.707.293l-.532.532A1 1 0 018.586 15H4"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 px-5 py-2.5 rounded-xl border border-[#2D6A4F] text-[#2D6A4F] text-sm font-medium hover:bg-[#2D6A4F]/5 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
