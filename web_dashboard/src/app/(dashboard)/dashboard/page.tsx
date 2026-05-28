"use client";

import { DataState, PageHeader } from "@/components/ui";
import { useMockDataLoad } from "@/hooks/useMockDataLoad";

const chartData = [
  { label: "Naranjas", value: 62, total: 248, color: "bg-orange-500" },
  { label: "Verdes", value: 48, total: 248, color: "bg-green-500" },
  { label: "Soterrados", value: 138, total: 248, color: "bg-gray-600" },
];

const recentContainers = [
  { id: "N-001", type: "Naranja", zone: "Zona Norte", status: "Lleno", lastUpdate: "Hace 2h" },
  { id: "V-042", type: "Verde", zone: "Zona Sur", status: "OK", lastUpdate: "Hace 5h" },
  { id: "S-012", type: "Soterrado", zone: "Zona Este", status: "Mantenimiento", lastUpdate: "Hace 1d" },
  { id: "N-103", type: "Naranja", zone: "Zona Oeste", status: "Lleno", lastUpdate: "Hace 3h" },
  { id: "V-089", type: "Verde", zone: "Zona Centro", status: "OK", lastUpdate: "Hace 8h" },
];

const stats = [
  { label: "Contenedores Totales", value: "248", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "from-[#2D6A4F] to-[#3a8a65]" },
  { label: "Contenedores Llenos", value: "37", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z", color: "from-red-500 to-red-600" },
  { label: "Reportes Hoy", value: "12", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "from-[#6B4F2A] to-[#8B6F3A]" },
  { label: "Sensores Activos", value: "215", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z", color: "from-blue-500 to-blue-600" },
];

const rutasRecoleccion = [
  { nombre: "Ruta Norte Prioritaria", zona: "Zona Norte", hora: "06:30", equipo: "Camion 01", avance: 72, prioridad: "Alta", contenedores: 36 },
  { nombre: "Ruta Centro Ambiental", zona: "Zona Centro", hora: "08:00", equipo: "Camion 04", avance: 48, prioridad: "Media", contenedores: 28 },
  { nombre: "Ruta Sur Residencial", zona: "Zona Sur", hora: "10:30", equipo: "Camion 02", avance: 18, prioridad: "Media", contenedores: 31 },
  { nombre: "Ruta Oeste Preventiva", zona: "Zona Oeste", hora: "14:00", equipo: "Camion 03", avance: 0, prioridad: "Baja", contenedores: 24 },
];

const rutasActivas = rutasRecoleccion.filter((ruta) => ruta.avance > 0 && ruta.avance < 100).length;
const contenedoresProgramados = rutasRecoleccion.reduce((total, ruta) => total + ruta.contenedores, 0);

export default function DashboardPage() {
  const { loading, error, reload } = useMockDataLoad(true, { delayMs: 700 });

  return (
    <>
      <PageHeader
        title="Panel de Control"
        description="Resumen operativo del sistema de contenedores urbanos"
      />
      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        loadingMessage="Cargando panel de control..."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 xl:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Plan operativo de recoleccion</h2>
                <p className="text-sm text-gray-400 mt-1">Seguimiento del turno actual por ruta y prioridad</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] font-semibold">
                {rutasActivas} rutas activas
              </span>
            </div>
            <div className="space-y-4">
              {rutasRecoleccion.map((ruta) => (
                <div key={ruta.nombre} className="border border-gray-100 rounded-2xl p-4 hover:border-[#2D6A4F]/30 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{ruta.nombre}</p>
                      <p className="text-xs text-gray-400">
                        {ruta.zona} &bull; {ruta.equipo} &bull; Salida {ruta.hora}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          ruta.prioridad === "Alta"
                            ? "bg-red-100 text-red-700"
                            : ruta.prioridad === "Media"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {ruta.prioridad}
                      </span>
                      <span className="text-xs text-gray-400">{ruta.contenedores} contenedores</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`${ruta.avance >= 70 ? "bg-[#2D6A4F]" : ruta.avance > 0 ? "bg-yellow-500" : "bg-gray-300"} h-2.5 rounded-full`}
                        style={{ width: `${ruta.avance}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-10 text-right">{ruta.avance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2D6A4F] to-[#1a4a35] rounded-2xl shadow-sm p-6 text-white">
            <p className="text-sm text-white/70">Resumen del turno</p>
            <h2 className="text-2xl font-bold mt-1">Operacion diaria</h2>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{rutasRecoleccion.length}</p>
                <p className="text-xs text-white/70">Rutas</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{contenedoresProgramados}</p>
                <p className="text-xs text-white/70">Contenedores</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Prioridad alta</span>
                <span className="font-semibold">Zona Norte</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Proxima salida</span>
                <span className="font-semibold">14:00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Estado general</span>
                <span className="font-semibold">En progreso</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Estado de Contenedores</h2>
            <div className="space-y-4">
              {[
                { zona: "Zona Norte", llenos: 12, total: 62, color: "bg-[#2D6A4F]" },
                { zona: "Zona Sur", llenos: 8, total: 58, color: "bg-[#2D6A4F]" },
                { zona: "Zona Este", llenos: 10, total: 55, color: "bg-[#2D6A4F]" },
                { zona: "Zona Oeste", llenos: 7, total: 73, color: "bg-[#2D6A4F]" },
              ].map((z, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{z.zona}</span>
                    <span className="text-gray-400">
                      {z.llenos}/{z.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${z.color} h-2.5 rounded-full`}
                      style={{ width: `${(z.llenos / z.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ultimos Reportes</h2>
            <div className="space-y-3">
              {[
                { tipo: "Vertedero Ilegal", ubicacion: "Av. America y Calle 23", hora: "Hace 15 min", estado: "Pendiente" },
                { tipo: "Contenedor Danado", ubicacion: "Plaza Colon", hora: "Hace 42 min", estado: "En Proceso" },
                { tipo: "Vertedero Ilegal", ubicacion: "Calle Sucre esq. Bolivar", hora: "Hace 1 hora", estado: "Pendiente" },
                { tipo: "Contenedor Lleno", ubicacion: "Parque de la Familia", hora: "Hace 2 horas", estado: "Atendido" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.tipo}</p>
                    <p className="text-xs text-gray-400">
                      {r.ubicacion} &bull; {r.hora}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.estado === "Pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.estado === "En Proceso"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {r.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contenedores por Tipo</h2>
            <div className="flex items-end gap-8 h-48">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-sm font-bold text-gray-700 mb-2">{d.value}</span>
                  <div
                    className={`w-full rounded-t-lg ${d.color} transition-all duration-500`}
                    style={{ height: `${(d.value / d.total) * 100 * 2.5}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contenedores Recientes</h2>
            <div className="space-y-3">
              {recentContainers.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {c.id} <span className="text-xs text-gray-400">({c.type})</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {c.zone} &bull; {c.lastUpdate}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      c.status === "Lleno"
                        ? "bg-red-100 text-red-700"
                        : c.status === "Mantenimiento"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DataState>
    </>
  );
}
