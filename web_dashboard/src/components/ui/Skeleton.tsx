/* ------------------------------------------------------------------ */
/*  Shimmer overlay helper – used by every skeleton variant            */
/* ------------------------------------------------------------------ */
export function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-100 to-transparent pointer-events-none ${className}`}
    />
  );
}

function ShimmerLight() {
  return (
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
  );
}

/* ------------------------------------------------------------------ */
/*  Generic skeleton primitives                                        */
/* ------------------------------------------------------------------ */
export function SkeletonBlock({
  className = "h-4 w-full",
}: {
  className?: string;
}) {
  return <div className={`bg-gray-200 rounded ${className}`} />;
}

/* ------------------------------------------------------------------ */
/*  Dashboard page skeletons                                           */
/* ------------------------------------------------------------------ */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 overflow-hidden">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <Shimmer />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 overflow-hidden">
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
        <div className="h-2 bg-gray-200 rounded-full w-full" />
        <Shimmer />
      </div>
    </div>
  );
}

export function SkeletonStatBox() {
  return (
    <div className="bg-white/10 rounded-lg p-3 overflow-hidden">
      <div className="relative">
        <div className="h-7 bg-white/20 rounded w-12 mb-1" />
        <div className="h-3 bg-white/20 rounded w-16" />
        <ShimmerLight />
      </div>
    </div>
  );
}

export function SkeletonReportRow() {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 overflow-hidden">
      <div className="relative flex-1">
        <div className="h-4 bg-gray-200 rounded w-40 mb-1" />
        <div className="h-3 bg-gray-200 rounded w-32" />
        <Shimmer />
      </div>
      <div className="h-5 bg-gray-200 rounded w-20" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="flex items-end gap-8 h-48">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full overflow-hidden">
          <div className="relative">
            <div className="h-6 bg-gray-200 rounded w-12 mb-2" />
            <div className="w-full bg-gray-200 rounded-t-lg h-32" />
            <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
            <Shimmer />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 overflow-hidden">
      <div className="relative">
        <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-24" />
        <Shimmer />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contenedores page skeleton                                         */
/* ------------------------------------------------------------------ */
export function SkeletonContenedoresPage() {
  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-5 overflow-hidden">
            <div className="relative">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <Shimmer />
            </div>
          </div>
        ))}
      </div>
      {/* Search bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg overflow-hidden relative">
          <Shimmer />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-20 bg-gray-200 rounded-lg overflow-hidden relative">
            <Shimmer />
          </div>
        ))}
      </div>
      {/* List items */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Alertas page skeleton                                              */
/* ------------------------------------------------------------------ */
export function SkeletonAlertasPage() {
  return (
    <>
      {/* Alert counter */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 overflow-hidden">
        <div className="relative">
          <div className="h-9 bg-gray-200 rounded w-12 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64" />
          <Shimmer />
        </div>
      </div>
      {/* Alert cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm overflow-hidden">
            <div className="relative">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 bg-gray-200 rounded w-40" />
                    <div className="h-5 bg-gray-200 rounded-full w-16" />
                    <div className="h-5 bg-gray-200 rounded-full w-32" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-28" />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="h-4 bg-gray-200 rounded w-36" />
                    <div className="h-4 bg-gray-200 rounded w-36" />
                    <div className="h-4 bg-gray-200 rounded w-48 sm:col-span-2" />
                  </div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg w-28" />
              </div>
              <Shimmer />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Mapa page skeleton                                                 */
/* ------------------------------------------------------------------ */
export function SkeletonMapaPage() {
  return (
    <>
      {/* Stat cards row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm overflow-hidden">
            <div className="relative">
              <div className="h-7 bg-gray-200 rounded w-10 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-24" />
              <Shimmer />
            </div>
          </div>
        ))}
      </div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 rounded-full overflow-hidden relative">
            <Shimmer />
          </div>
        ))}
      </div>
      {/* Heatmap section */}
      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 overflow-hidden">
        <div className="relative">
          <div className="h-5 bg-gray-200 rounded w-64 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-96" />
          <Shimmer />
        </div>
      </div>
      {/* Map + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-2 space-y-4">
          {/* Map placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 h-[480px] overflow-hidden">
            <div className="relative w-full h-full bg-gray-200 rounded-xl">
              <Shimmer />
            </div>
          </div>
          {/* My containers panel */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 overflow-hidden">
            <div className="relative">
              <div className="h-5 bg-gray-200 rounded w-56 mb-3" />
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-3">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-48" />
                  </div>
                ))}
              </div>
              <Shimmer />
            </div>
          </div>
        </div>
        {/* Right side list */}
        <div className="bg-white rounded-2xl shadow-sm p-4 overflow-hidden">
          <div className="relative">
            <div className="h-5 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-9 bg-gray-200 rounded-lg w-full mb-3" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-3">
                  <div className="flex justify-between mb-1">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                    <div className="h-5 bg-gray-200 rounded-full w-16" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-40 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-28" />
                </div>
              ))}
            </div>
            <Shimmer />
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Reportes page skeleton                                             */
/* ------------------------------------------------------------------ */
export function SkeletonReportesPage() {
  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-5 overflow-hidden">
            <div className="relative">
              <div className="h-9 bg-gray-200 rounded w-12 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <Shimmer />
            </div>
          </div>
        ))}
      </div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg overflow-hidden relative">
            <Shimmer />
          </div>
        ))}
      </div>
      {/* Table skeleton */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 flex gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-20 overflow-hidden relative">
              <Shimmer />
            </div>
          ))}
        </div>
        {/* Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center gap-6 overflow-hidden">
            <div className="relative flex-1 flex items-center gap-6">
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded-lg w-24" />
              <div className="h-14 w-14 bg-gray-200 rounded-lg flex-shrink-0" />
              <Shimmer />
            </div>
          </div>
        ))}
      </div>
      {/* Chart and summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-2 overflow-hidden">
          <div className="relative">
            <div className="h-5 bg-gray-200 rounded w-52 mb-4" />
            <div className="flex items-end gap-4 h-40">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="h-4 bg-gray-200 rounded w-6 mb-1" />
                  <div className="w-full bg-gray-200 rounded-t-lg" style={{ height: `${30 + i * 8}%` }} />
                  <div className="h-3 bg-gray-200 rounded w-8 mt-2" />
                </div>
              ))}
            </div>
            <Shimmer />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="relative">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-4 bg-gray-200 rounded w-36" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <Shimmer />
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Configuración page skeleton                                        */
/* ------------------------------------------------------------------ */
export function SkeletonConfiguracionPage() {
  return (
    <div className="max-w-2xl space-y-5">
      {/* Notificaciones */}
      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
        <div className="relative">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-56" />
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="h-4 bg-gray-200 rounded w-44 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-52" />
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full" />
          </div>
          <Shimmer />
        </div>
      </div>
      {/* Apariencia */}
      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
        <div className="relative">
          <div className="h-5 bg-gray-200 rounded w-24 mb-4" />
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-48" />
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full" />
          </div>
          <Shimmer />
        </div>
      </div>
      {/* Idioma */}
      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
        <div className="relative">
          <div className="h-5 bg-gray-200 rounded w-16 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
          <Shimmer />
        </div>
      </div>
      {/* Info del sistema */}
      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
        <div className="relative">
          <div className="h-5 bg-gray-200 rounded w-44 mb-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-40" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <Shimmer />
        </div>
      </div>
      {/* Reset button */}
      <div className="h-12 bg-gray-200 rounded-xl overflow-hidden relative">
        <Shimmer />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard page skeleton (full page)                                */
/* ------------------------------------------------------------------ */
export function SkeletonDashboardPage() {
  return (
    <>
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Routes + summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 xl:col-span-2 overflow-hidden">
          <div className="relative">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 mb-5" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
            <Shimmer />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#2D6A4F] to-[#1a4a35] rounded-2xl shadow-sm p-4 text-white self-start w-full max-w-xs xl:max-w-none overflow-hidden">
          <div className="relative">
            <div className="h-4 bg-white/20 rounded w-24 mb-2" />
            <div className="h-6 bg-white/20 rounded w-40 mb-4" />
            <div className="grid grid-cols-2 gap-2 mt-4">
              <SkeletonStatBox />
              <SkeletonStatBox />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-white/20 rounded w-full" />
              <div className="h-3 bg-white/20 rounded w-full" />
            </div>
            <ShimmerLight />
          </div>
        </div>
      </div>
      {/* Last reports */}
      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
        <div className="relative">
          <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonReportRow key={i} />
            ))}
          </div>
          <Shimmer />
        </div>
      </div>
      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-8 overflow-hidden">
        <div className="relative">
          <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
          <SkeletonChart />
          <Shimmer />
        </div>
      </div>
    </>
  );
}
