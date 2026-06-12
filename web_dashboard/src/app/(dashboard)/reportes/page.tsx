"use client";

import { useMemo, useState } from "react";
import { DataState, EmptyState, PageHeader } from "@/components/ui";
import { useDumpReports } from "@/hooks/useDumpReports";
import { DumpReportRow, updateDumpReportEstado } from "@/lib/supabase";

const estadoFiltros = ["Todos", "Pendiente", "En Proceso", "Atendido"] as const;

function formatRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}

function formatUbicacion(lat: number, lon: number) {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

function estadoToDb(estado: string): DumpReportRow["estado"] | null {
  switch (estado) {
    case "Pendiente":
      return "pendiente";
    case "En Proceso":
      return "en_proceso";
    case "Atendido":
      return "atendido";
    default:
      return null;
  }
}

export default function ReportesPage() {
  const { loading, error, reports, reload, setReports } = useDumpReports();
  const [filtro, setFiltro] = useState<(typeof estadoFiltros)[number]>("Todos");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [estadoError, setEstadoError] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    if (!reports) return [];
    if (filtro === "Todos") return reports;
    const dbEstado = estadoToDb(filtro);
    return reports.filter((r) => r.estado === dbEstado);
  }, [reports, filtro]);

  const pendientes = reports.filter((r) => r.estado === "pendiente").length;
  const enProceso = reports.filter((r) => r.estado === "en_proceso").length;
  const atendidos = reports.filter((r) => r.estado === "atendido").length;

  const weeklySummary = useMemo(() => {
    const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const counts = new Array(7).fill(0);
    const now = new Date();

    for (const report of reports) {
      const date = new Date(report.created_at);
      const diffDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays >= 0 && diffDays < 7) {
        counts[date.getDay()] += 1;
      }
    }

    const ordered = [1, 2, 3, 4, 5, 6, 0];
    return ordered.map((dayIndex) => ({
      day: days[dayIndex],
      count: counts[dayIndex],
    }));
  }, [reports]);

  const maxWeekly = Math.max(...weeklySummary.map((d) => d.count), 1);

  async function handleEstadoChange(
    reportId: string | number,
    estado: DumpReportRow["estado"]
  ) {
    const previous = reports.find((report) => report.id === reportId);
    if (!previous || previous.estado === estado) return;

    setEstadoError(null);
    setUpdatingId(String(reportId));
    setReports((current) =>
      current.map((report) =>
        report.id === reportId ? { ...report, estado } : report
      )
    );

    try {
      const savedEstado = await updateDumpReportEstado(reportId, estado);
      setReports((current) =>
        current.map((report) =>
          report.id === reportId ? { ...report, estado: savedEstado } : report
        )
      );
    } catch (err) {
      setReports((current) =>
        current.map((report) =>
          report.id === reportId ? { ...report, estado: previous.estado } : report
        )
      );
      setEstadoError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado del reporte"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Reportes de Vertederos"
        description="Reportes ciudadanos enviados desde la app movil con foto y ubicacion"
      />
      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        loadingMessage="Cargando reportes..."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-yellow-500">
            <p className="text-3xl font-bold text-gray-800">{pendientes}</p>
            <p className="text-sm text-gray-500 mt-1">Pendientes</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-blue-500">
            <p className="text-3xl font-bold text-gray-800">{enProceso}</p>
            <p className="text-sm text-gray-500 mt-1">En Proceso</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-500">
            <p className="text-3xl font-bold text-gray-800">{atendidos}</p>
            <p className="text-sm text-gray-500 mt-1">Atendidos</p>
          </div>
        </div>

        {estadoError ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {estadoError}
          </div>
        ) : null}

        <div className="flex gap-2 mb-4 flex-wrap">
          {estadoFiltros.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filtro === e
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            title="Sin reportes"
            message="No hay reportes de vertederos con el filtro seleccionado."
            actionLabel="Ver todos"
            onAction={() => setFiltro("Todos")}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Ubicacion</th>
                  <th className="px-6 py-3 font-medium">Usuario</th>
                  <th className="px-6 py-3 font-medium">Hora</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      Vertedero Ilegal
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <a
                        href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2D6A4F] hover:underline"
                      >
                        {formatUbicacion(r.latitude, r.longitude)}
                      </a>
                      {r.description ? (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {r.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {r.user_id ? r.user_id.slice(0, 8) + "..." : "Usuario movil"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatRelativeTime(r.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={r.estado}
                        disabled={updatingId === String(r.id)}
                        onChange={(e) =>
                          handleEstadoChange(
                            r.id,
                            e.target.value as DumpReportRow["estado"]
                          )
                        }
                        className={`text-xs px-2 py-1 rounded-lg font-medium border cursor-pointer ${
                          r.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : r.estado === "en_proceso"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-green-100 text-green-700 border-green-200"
                        }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="atendido">Atendido</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {r.photo_url ? (
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto(r.photo_url ?? null)}
                          className="block"
                        >
                          <img
                            src={r.photo_url}
                            alt="Foto del vertedero"
                            className="w-14 h-14 rounded-lg object-cover border border-gray-200 hover:opacity-90"
                          />
                        </button>
                      ) : r.photo_path ? (
                        <span className="text-xs text-amber-600">
                          Foto no disponible
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Sin foto</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Reportes por dia (ultimos 7 dias)
            </h2>
            <div className="flex items-end gap-4 h-40">
              {weeklySummary.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <span className="text-xs font-bold text-gray-700 mb-1">
                    {d.count}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-[#2D6A4F] transition-all duration-500"
                    style={{ height: `${(d.count / maxWeekly) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Resumen de vertederos
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-semibold text-gray-800">
                  {reports.length}
                </span>{" "}
                reportes en total
              </p>
              <p>{pendientes} pendientes de revision</p>
              <p>{enProceso} en proceso de atencion</p>
              <p>{atendidos} atendidos</p>
            </div>
          </div>
        </div>
      </DataState>

      {selectedPhoto ? (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Foto ampliada del vertedero"
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
