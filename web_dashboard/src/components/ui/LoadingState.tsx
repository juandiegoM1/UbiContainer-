type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = "Cargando informacion...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl bg-white shadow-sm px-6 py-16 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-10 h-10 border-4 border-[#2D6A4F]/20 border-t-[#2D6A4F] rounded-full animate-spin" />
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
}
