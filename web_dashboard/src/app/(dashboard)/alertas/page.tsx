"use client";

import { useMemo } from "react";
import { CapacityBadge } from "@/components/containers/CapacityBadge";
import { DataState, EmptyState, PageHeader } from "@/components/ui";
import { useContainers } from "@/hooks/useContainers";
import {
  CAPACITY_ALERT_THRESHOLD,
  getCapacityAlerts,
} from "@/lib/containerCapacity";
import { containerColor, containerLabel } from "@/lib/containers";

export default function AlertasPage() {
  const { loading, error, containers, reload } = useContainers();

  const alertas = useMemo(() => getCapacityAlerts(containers), [containers]);

  return (
    <>
      <PageHeader
        title="Alertas de capacidad"
        description={`Contenedores al ${CAPACITY_ALERT_THRESHOLD}% o mas de su capacidad, o marcados como llenos`}
      />
      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        loadingMessage="Cargando alertas..."
      >
        <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
          <p className="text-3xl font-bold text-orange-800">{alertas.length}</p>
          <p className="text-sm text-orange-700 mt-1">
            Contenedor{alertas.length === 1 ? "" : "es"} requieren atencion prioritaria
          </p>
        </div>

        {alertas.length === 0 ? (
          <EmptyState
            title="Sin alertas activas"
            message={`No hay contenedores al ${CAPACITY_ALERT_THRESHOLD}% o mas de capacidad en este momento.`}
          />
        ) : (
          <div className="space-y-4">
            {alertas.map((container) => (
              <div
                key={container.id}
                className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Contenedor #{container.id}
                      </h2>
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: containerColor(container.tipo) }}
                      >
                        {containerLabel(container.tipo)}
                      </span>
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">
                        Alerta de capacidad
                      </span>
                    </div>

                    <CapacityBadge container={container} />

                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-gray-700">Latitud:</span>{" "}
                        {container.latitude.toFixed(6)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Longitud:</span>{" "}
                        {container.longitude.toFixed(6)}
                      </p>
                      <p className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Ubicacion:</span>{" "}
                        {container.nombre ?? "Sin nombre"}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${container.latitude},${container.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a4a35]"
                  >
                    Ver en mapa
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}
