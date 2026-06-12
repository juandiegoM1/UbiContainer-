"use client";

import { useMemo, useState } from "react";
import { DataState, EmptyState, PageHeader } from "@/components/ui";
import { useContainers } from "@/hooks/useContainers";
import { matchesContainerSearch } from "@/lib/containerSearch";
import { CapacityBadge } from "@/components/containers/CapacityBadge";
import {
  getCapacityAlerts,
  isCapacityAlert,
} from "@/lib/containerCapacity";
import {
  ContainerRow,
  containerColor,
  containerLabel,
} from "@/lib/containers";

const tipos = ["Todos", "Verde", "Naranja", "Soterrado"] as const;

function matchesTipo(container: ContainerRow, tipo: string) {
  if (tipo === "Todos") return true;
  return containerLabel(container.tipo) === tipo;
}

export default function ContenedoresPage() {
  const { loading, error, containers, reload } = useContainers();
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState<(typeof tipos)[number]>("Todos");

  const counts = useMemo(() => {
    const verde = containers.filter((c) => c.tipo === "verde").length;
    const naranja = containers.filter((c) => c.tipo === "naranja").length;
    const soterrado = containers.filter((c) => c.tipo === "soterrado").length;
    return { total: containers.length, verde, naranja, soterrado };
  }, [containers]);

  const alertas = useMemo(() => getCapacityAlerts(containers), [containers]);

  const filtrados = useMemo(() => {
    return containers.filter((c) => {
      return matchesTipo(c, tipo) && matchesContainerSearch(c, busqueda);
    });
  }, [containers, busqueda, tipo]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setTipo("Todos");
  };

  return (
    <>
      <PageHeader
        title="Contenedores"
        description="Consulta el listado de contenedores registrados"
      />
      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        loadingMessage="Cargando contenedores..."
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-[#2D6A4F]">
            <p className="text-3xl font-bold text-gray-800">{counts.total}</p>
            <p className="text-sm text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-500">
            <p className="text-3xl font-bold text-gray-800">{counts.verde}</p>
            <p className="text-sm text-gray-500 mt-1">Verdes</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-orange-500">
            <p className="text-3xl font-bold text-gray-800">{counts.naranja}</p>
            <p className="text-sm text-gray-500 mt-1">Naranjas</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-red-500">
            <p className="text-3xl font-bold text-gray-800">{counts.soterrado}</p>
            <p className="text-sm text-gray-500 mt-1">Soterrados</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-orange-500">
            <p className="text-3xl font-bold text-gray-800">{alertas.length}</p>
            <p className="text-sm text-gray-500 mt-1">En alerta</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por #ID, nombre o tipo..."
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          {tipos.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tipo === t
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            title="Ningun contenedor encontrado"
            message={
              containers.length === 0
                ? "No hay contenedores en la base de datos o faltan permisos de lectura en Supabase."
                : "No hay resultados con los filtros actuales. Prueba otra busqueda o limpia los filtros."
            }
            actionLabel="Limpiar filtros"
            onAction={limpiarFiltros}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Latitud</th>
                  <th className="px-6 py-3 font-medium">Longitud</th>
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Capacidad</th>
                  <th className="px-6 py-3 font-medium">Estado operativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.map((c) => (
                  <tr
                    key={c.id}
                    className={`transition ${
                      isCapacityAlert(c) ? "bg-orange-50/60 hover:bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">#{c.id}</td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium text-white"
                        style={{ backgroundColor: containerColor(c.tipo) }}
                      >
                        {containerLabel(c.tipo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.latitude.toFixed(5)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.longitude.toFixed(5)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.nombre ?? "—"}</td>
                    <td className="px-6 py-4">
                      <CapacityBadge container={c} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                      {c.estado ?? "activo"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataState>
    </>
  );
}
