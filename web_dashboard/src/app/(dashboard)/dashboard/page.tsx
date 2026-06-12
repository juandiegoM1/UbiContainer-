"use client";

import { useMemo } from "react";
import { DataState, PageHeader } from "@/components/ui";
import { useContainers } from "@/hooks/useContainers";
import { useDumpReports } from "@/hooks/useDumpReports";
const rutasRecoleccion = [
  { nombre: "Ruta Norte Prioritaria", zona: "Zona Norte", hora: "06:30", equipo: "Camion 01", avance: 72, prioridad: "Alta", contenedores: 36 },
  { nombre: "Ruta Centro Ambiental", zona: "Zona Centro", hora: "08:00", equipo: "Camion 04", avance: 48, prioridad: "Media", contenedores: 28 },
  { nombre: "Ruta Sur Residencial", zona: "Zona Sur", hora: "10:30", equipo: "Camion 02", avance: 18, prioridad: "Media", contenedores: 31 },
  { nombre: "Ruta Oeste Preventiva", zona: "Zona Oeste", hora: "14:00", equipo: "Camion 03", avance: 0, prioridad: "Baja", contenedores: 24 },
];

const rutasActivas = rutasRecoleccion.filter((ruta) => ruta.avance > 0 && ruta.avance < 100).length;
const contenedoresProgramados = rutasRecoleccion.reduce((total, ruta) => total + ruta.contenedores, 0);
const SENSORES_ACTIVOS = 0;

function isToday(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function DashboardPage() {
  const {
    loading: loadingContainers,
    error: containersError,
    containers,
    dbTotal,
    reload: reloadContainers,
  } = useContainers();
  const {
    loading: loadingReports,
    error: reportsError,
    reports,
    reload: reloadReports,
  } = useDumpReports();

  const loading = loadingContainers || loadingReports;
  const error = containersError ?? reportsError;

  const counts = useMemo(() => {
    const verde = containers.filter((c) => c.tipo === "verde").length;
    const naranja = containers.filter((c) => c.tipo === "naranja").length;
    const soterrado = containers.filter((c) => c.tipo === "soterrado").length;
    return {
      total: dbTotal ?? containers.length,
      verde,
      naranja,
      soterrado,
    };
  }, [containers, dbTotal]);

  const reportesHoy = useMemo(
    () => reports.filter((r) => isToday(r.created_at)).length,
    [reports]
  );

  const reportesPendientes = useMemo(
    () => reports.filter((r) => r.estado === "pendiente").length,
    [reports]
  );

  const chartData = useMemo(
    () => [
      { label: "Naranjas", value: counts.naranja, color: "bg-orange-500" },
      { label: "Verdes", value: counts.verde, color: "bg-green-500" },
      { label: "Soterrados", value: counts.soterrado, color: "bg-red-500" },
    ],
    [counts]
  );

  const chartMax = Math.max(counts.total, 1);

  const stats = [
    {
      label: "Contenedores Totales",
      value: String(counts.total),
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      color: "from-[#2D6A4F] to-[#3a8a65]",
    },
    {
      label: "Verdes",
      value: String(counts.verde),
      color: "from-green-500 to-green-600",
    },
    {
      label: "Naranjas",
      value: String(counts.naranja),
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Soterrados",
      value: String(counts.soterrado),
      color: "from-red-500 to-red-600",
    },
    {
      label: "Reportes Hoy",
      value: String(reportesHoy),
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      color: "from-[#6B4F2A] to-[#8B6F3A]",
    },
    {
      label: "Sensores activos",
      value: String(SENSORES_ACTIVOS),
      icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
      color: "from-blue-500 to-blue-600",
    },
  ];

  const ultimosReportes = reports.slice(0, 4);

  return (
    <>
      <PageHeader
        title="Panel de Control"
        description="Resumen operativo del sistema de contenedores urbanos"
      />
      <DataState
        loading={loading}
        error={error}
        onRetry={() => {
          reloadContainers();
          reloadReports();
        }}
        loadingMessage="Cargando panel de control..."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  {"icon" in stat && stat.icon ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                    </svg>
                  ) : null}
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
                <div
                  key={ruta.nombre}
                  className="border border-gray-100 rounded-2xl p-4 hover:border-[#2D6A4F]/30 transition"
                >
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
                <p className="text-2xl font-bold">{counts.total}</p>
                <p className="text-xs text-white/70">Contenedores</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Sensores activos</span>
                <span className="font-semibold">{SENSORES_ACTIVOS}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Reportes pendientes</span>
                <span className="font-semibold">{reportesPendientes}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Soterrados</span>
                <span className="font-semibold">{counts.soterrado}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Estado general</span>
                <span className="font-semibold">En progreso</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ultimos Reportes</h2>
            <div className="space-y-3">
              {ultimosReportes.length === 0 ? (
                <p className="text-sm text-gray-500">No hay reportes registrados todavia.</p>
              ) : (
                ultimosReportes.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">Vertedero reportado</p>
                      <p className="text-xs text-gray-400">
                        {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)} &bull;{" "}
                        {new Date(r.created_at).toLocaleString("es-BO")}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.estado === "en_proceso"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.estado === "pendiente"
                        ? "Pendiente"
                        : r.estado === "en_proceso"
                          ? "En Proceso"
                          : "Atendido"}
                    </span>
                  </div>
                ))
              )}
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribucion por Tipo</h2>
          <div className="flex items-end gap-8 h-48">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-sm font-bold text-gray-700 mb-2">{d.value}</span>
                <div
                  className={`w-full rounded-t-lg ${d.color} transition-all duration-500`}
                  style={{ height: `${(d.value / chartMax) * 100}%`, minHeight: d.value > 0 ? "8px" : "0" }}
                />
                <span className="text-xs text-gray-500 mt-2">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </DataState>
    </>
  );
}
