"use client";

import { useMemo, useState } from "react";
import { DataState, EmptyState, PageHeader } from "@/components/ui";
import { useMockDataLoad } from "@/hooks/useMockDataLoad";

type Reporte = {
  id: number;
  tipo: string;
  ubicacion: string;
  hora: string;
  estado: string;
  foto: boolean;
};

const reportsMock: Reporte[] = [
  { id: 1, tipo: "Vertedero Ilegal", ubicacion: "Av. America y Calle 23", hora: "15 min ago", estado: "Pendiente", foto: true },
  { id: 2, tipo: "Contenedor Danado", ubicacion: "Plaza Colon", hora: "42 min ago", estado: "En Proceso", foto: false },
  { id: 3, tipo: "Vertedero Ilegal", ubicacion: "Calle Sucre esq. Bolivar", hora: "1 h ago", estado: "Pendiente", foto: true },
  { id: 4, tipo: "Contenedor Lleno", ubicacion: "Parque de la Familia", hora: "2 h ago", estado: "Atendido", foto: false },
  { id: 5, tipo: "Vertedero Ilegal", ubicacion: "Av. Blanco Galindo km 4", hora: "3 h ago", estado: "Pendiente", foto: true },
  { id: 6, tipo: "Contenedor Danado", ubicacion: "Av. Heroinas y Ayacucho", hora: "5 h ago", estado: "En Proceso", foto: false },
  { id: 7, tipo: "Contenedor Lleno", ubicacion: "Av. Petrolera", hora: "8 h ago", estado: "Atendido", foto: false },
];

const estadoFiltros = ["Todos", "Pendiente", "En Proceso", "Atendido"];

const weeklySummary = [
  { day: "Lun", count: 4 },
  { day: "Mar", count: 7 },
  { day: "Mie", count: 3 },
  { day: "Jue", count: 8 },
  { day: "Vie", count: 5 },
  { day: "Sab", count: 2 },
  { day: "Dom", count: 6 },
];

const tipoResumen = [
  { tipo: "Vertedero Ilegal", total: 18, atendidos: 12, pendientes: 4, enProceso: 2, color: "bg-red-500" },
  { tipo: "Contenedor Danado", total: 9, atendidos: 5, pendientes: 2, enProceso: 2, color: "bg-yellow-500" },
  { tipo: "Contenedor Lleno", total: 11, atendidos: 8, pendientes: 2, enProceso: 1, color: "bg-orange-500" },
];

export default function ReportesPage() {
  const { loading, error, data: reports, reload } = useMockDataLoad(reportsMock);
  const [filtro, setFiltro] = useState("Todos");

  const filtrados = useMemo(() => {
    if (!reports) return [];
    return filtro === "Todos" ? reports : reports.filter((r) => r.estado === filtro);
  }, [reports, filtro]);

  const pendientes = reports?.filter((r) => r.estado === "Pendiente").length ?? 0;
  const enProceso = reports?.filter((r) => r.estado === "En Proceso").length ?? 0;
  const atendidos = reports?.filter((r) => r.estado === "Atendido").length ?? 0;

  return (
    <>
      <PageHeader
        title="Reportes de Contenedores"
        description="Gestion de reportes ciudadanos y estado de contenedores"
      />
      <DataState loading={loading} error={error} onRetry={reload} loadingMessage="Cargando reportes...">
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

        <div className="flex gap-2 mb-4 flex-wrap">
          {estadoFiltros.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filtro === e ? "bg-[#2D6A4F] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
            >
              {e}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            title="Sin reportes"
            message="No hay reportes con el filtro seleccionado."
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
                  <th className="px-6 py-3 font-medium">Hora</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{r.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.ubicacion}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.hora}</td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      {r.foto ? (
                        <span className="text-xs text-[#2D6A4F] font-medium bg-green-50 px-2 py-1 rounded">Adjunta</span>
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Reportes por dia (esta semana)</h2>
            <div className="flex items-end gap-4 h-40">
              {weeklySummary.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs font-bold text-gray-700 mb-1">{d.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-[#2D6A4F] transition-all duration-500"
                    style={{ height: `${(d.count / 10) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen por tipo</h2>
            <div className="space-y-4">
              {tipoResumen.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{t.tipo}</span>
                    <span className="text-gray-500">{t.total} total</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div className={`${t.color} h-2 rounded-full`} style={{ width: `${(t.atendidos / t.total) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{t.atendidos} atendidos</span>
                    <span>{t.pendientes} pendientes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DataState>
    </>
  );
}
