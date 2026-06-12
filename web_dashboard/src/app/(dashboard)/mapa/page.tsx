"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataState, PageHeader } from "@/components/ui";
import { useContainers } from "@/hooks/useContainers";
import { useDumpReports } from "@/hooks/useDumpReports";
import { getSession } from "@/lib/auth";
import {
  HeatmapScope,
  buildHeatmapPoints,
  buildHeatmapRenderPoints,
} from "@/lib/dumpReportHeatmap";
import { matchesContainerSearch } from "@/lib/containerSearch";
import {
  ContainerInput,
  ContainerRow,
  ContainerTipo,
  containerColor,
  containerLabel,
  createContainer,
  deleteContainer,
  updateContainer,
} from "@/lib/containers";
import {
  isMyContainer,
  registerMyContainer,
  unregisterMyContainer,
} from "@/lib/myContainers";

const ContainersMap = dynamic(() => import("@/components/mapa/ContainersMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] rounded-xl bg-gray-100 animate-pulse" />
  ),
});

type FilterTipo = "todos" | "mis" | ContainerTipo;
type FormMode = "view" | "edit" | "create";

const filtros: { id: FilterTipo; label: string; color: string }[] = [
  { id: "todos", label: "Todos", color: "#2D6A4F" },
  { id: "mis", label: "Mis registros", color: "#2563eb" },
  { id: "verde", label: "Verde", color: "#22c55e" },
  { id: "naranja", label: "Naranja", color: "#f97316" },
  { id: "soterrado", label: "Soterrado", color: "#ef4444" },
];

const defaultForm: ContainerInput = {
  tipo: "naranja",
  latitude: -17.3895,
  longitude: -66.1568,
  nombre: "",
  cantidad: 1,
  estado: "activo",
  nivel_llenado: 0,
};

function formatCoord(value: number | null | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(5) : "N/D";
}

function isValidCoordinate(latitude: number, longitude: number) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export default function MapaPage() {
  const { loading, error, containers, dbTotal, reload, setContainers } =
    useContainers();
  const {
    error: reportsError,
    reports,
    reload: reloadReports,
  } = useDumpReports();
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    setSessionEmail(getSession()?.email ?? null);
  }, []);

  const [filtro, setFiltro] = useState<FilterTipo>("todos");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapScope, setHeatmapScope] = useState<HeatmapScope>("activos");
  const [myRegistryVersion, setMyRegistryVersion] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<FormMode>("view");
  const [pickOnMap, setPickOnMap] = useState(false);
  const [form, setForm] = useState<ContainerInput>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    reload();
  }, [reload]);

  const counts = useMemo(() => {
    const verde = containers.filter((c) => c.tipo === "verde").length;
    const naranja = containers.filter((c) => c.tipo === "naranja").length;
    const soterrado = containers.filter((c) => c.tipo === "soterrado").length;
    return { total: containers.length, verde, naranja, soterrado };
  }, [containers]);

  useEffect(() => {
    setMyRegistryVersion((value) => value + 1);
  }, [containers.length]);

  const misContenedores = useMemo(
    () => containers.filter((c) => isMyContainer(c, sessionEmail)),
    [containers, sessionEmail, myRegistryVersion]
  );

  const heatmapClusters = useMemo(
    () => buildHeatmapPoints(reports, heatmapScope),
    [reports, heatmapScope]
  );

  const heatmapRenderPoints = useMemo(
    () => buildHeatmapRenderPoints(reports, heatmapScope),
    [reports, heatmapScope]
  );

  const reportStats = useMemo(() => {
    const pendientes = reports.filter((r) => r.estado === "pendiente").length;
    const enProceso = reports.filter((r) => r.estado === "en_proceso").length;
    const atendidos = reports.filter((r) => r.estado === "atendido").length;
    return {
      total: reports.length,
      pendientes,
      enProceso,
      atendidos,
      activos: pendientes + enProceso,
    };
  }, [reports]);

  const filtrados = useMemo(() => {
    return containers.filter((c) => {
      const matchesScope =
        filtro === "todos"
          ? true
          : filtro === "mis"
            ? isMyContainer(c, sessionEmail)
            : c.tipo === filtro;
      return matchesScope && matchesContainerSearch(c, search);
    });
  }, [containers, filtro, search, sessionEmail, myRegistryVersion]);

  const selectedContainer =
    selectedId != null ? containers.find((c) => c.id === selectedId) ?? null : null;

  const draftPosition =
    mode === "create" || mode === "edit"
      ? { latitude: form.latitude, longitude: form.longitude, tipo: form.tipo }
      : null;

  function openFormPanel() {
    requestAnimationFrame(() => {
      rightPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function startCreate() {
    setSuccessMessage(null);
    setFormError(null);
    setMode("create");
    setSelectedId(null);
    setForm({ ...defaultForm });
    setPickOnMap(true);
    openFormPanel();
  }

  function selectContainerFromMap(container: ContainerRow) {
    setSuccessMessage(null);
    setFormError(null);
    setConfirmDelete(false);
    setMode("view");
    setSelectedId(container.id);
    setPickOnMap(false);
    openFormPanel();
  }

  function requestDelete(container: ContainerRow) {
    setSuccessMessage(null);
    setFormError(null);
    setMode("view");
    setSelectedId(container.id);
    setPickOnMap(false);
    setConfirmDelete(true);
    openFormPanel();
  }

  function startEdit(container: ContainerRow) {
    setSuccessMessage(null);
    setFormError(null);
    setMode("edit");
    setSelectedId(container.id);
    setForm({
      tipo: container.tipo,
      latitude: container.latitude,
      longitude: container.longitude,
      nombre: container.nombre ?? "",
      cantidad: container.cantidad ?? 1,
      estado: container.estado ?? "activo",
      nivel_llenado: container.nivel_llenado ?? 0,
    });
    setPickOnMap(false);
    openFormPanel();
  }

  function cancelForm() {
    setMode("view");
    setPickOnMap(false);
    setSelectedId(null);
    setFormError(null);
    setConfirmDelete(false);
  }

  const canDeleteSelected = selectedContainer != null;

  async function handleDelete(targetId?: number) {
    const idToDelete = targetId ?? selectedId;
    if (idToDelete == null) return;

    const container = containers.find((c) => c.id === idToDelete);
    if (!container) return;

    setFormError(null);
    setSuccessMessage(null);
    setDeleting(true);

    try {
      await deleteContainer(idToDelete);
      setContainers((current) => current.filter((item) => item.id !== idToDelete));
      if (sessionEmail) {
        unregisterMyContainer(sessionEmail, idToDelete);
        setMyRegistryVersion((value) => value + 1);
      }
      await reload();
      setSuccessMessage(`Contenedor #${idToDelete} eliminado correctamente.`);
      setMode("view");
      setSelectedId(null);
      setConfirmDelete(false);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el contenedor en Supabase"
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleMapClick(latitude: number, longitude: number) {
    setForm((prev) => ({ ...prev, latitude, longitude }));
    setFormError(null);
    if (mode === "edit" || mode === "create") return;
    setMode("create");
    setSelectedId(null);
    setPickOnMap(true);
    openFormPanel();
  }

  async function handleSave() {
    setFormError(null);
    setSuccessMessage(null);

    if (!isValidCoordinate(form.latitude, form.longitude)) {
      setFormError("Selecciona coordenadas validas en el mapa o ingresalas manualmente.");
      return;
    }

    setSaving(true);
    try {
      const payload: ContainerInput = {
        tipo: form.tipo,
        latitude: form.latitude,
        longitude: form.longitude,
        nombre: form.nombre?.trim() ? form.nombre.trim() : null,
        cantidad: form.cantidad ?? 1,
        estado: form.estado ?? "activo",
        nivel_llenado: Math.min(100, Math.max(0, form.nivel_llenado ?? 0)),
      };

      if (mode === "create") {
        const created = await createContainer({
          ...payload,
          creado_por: sessionEmail,
        });
        if (sessionEmail) {
          registerMyContainer(sessionEmail, created.id);
          setMyRegistryVersion((value) => value + 1);
        }
        setContainers((current) => {
          if (current.some((item) => item.id === created.id)) {
            return current.map((item) =>
              item.id === created.id ? created : item
            );
          }
          return [...current, created].sort((a, b) => a.id - b.id);
        });
        await reload();
        setSuccessMessage(`Contenedor #${created.id} registrado correctamente.`);
        setSelectedId(created.id);
        setMode("view");
        setPickOnMap(false);
        setFiltro("todos");
        return;
      }

      if (mode === "edit" && selectedId != null) {
        const updated = await updateContainer(selectedId, payload);
        setContainers((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        );
        await reload();
        setSuccessMessage(`Contenedor #${selectedId} actualizado correctamente.`);
        setMode("view");
        setPickOnMap(false);
      }
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el contenedor en Supabase"
      );
    } finally {
      setSaving(false);
    }
  }

  const layoutRevision =
    (mode === "create" ? 1 : 0) + (mode === "edit" ? 2 : 0) + (pickOnMap ? 4 : 0);

  const selectedContainerPanel =
    mode === "view" && selectedContainer != null ? (
      <div className="bg-white rounded-2xl shadow-sm p-4 border-2 border-[#2D6A4F]/30">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Contenedor #{selectedContainer.id}
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Puedes editar o eliminar cualquier contenedor del mapa, incluidos los recien registrados.
        </p>

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-1 rounded-full text-white font-medium"
              style={{ backgroundColor: containerColor(selectedContainer.tipo) }}
            >
              {containerLabel(selectedContainer.tipo)}
            </span>
            {isMyContainer(selectedContainer, sessionEmail) ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                Mio
              </span>
            ) : null}
          </div>
          <p>
            <span className="text-gray-500">Coordenadas:</span>{" "}
            {formatCoord(selectedContainer.latitude)}, {formatCoord(selectedContainer.longitude)}
          </p>
          {selectedContainer.nombre ? (
            <p>
              <span className="text-gray-500">Nombre:</span> {selectedContainer.nombre}
            </p>
          ) : null}
          <p>
            <span className="text-gray-500">Estado:</span>{" "}
            {selectedContainer.estado ?? "activo"}
          </p>
        </div>

        {formError ? <p className="text-sm text-red-600 mb-3">{formError}</p> : null}
        {successMessage ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">
            {successMessage}
          </p>
        ) : null}

        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => startEdit(selectedContainer)}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
              setFormError(null);
              setConfirmDelete(false);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>

        {canDeleteSelected ? (
          confirmDelete ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-3">
              <p className="text-sm text-red-800">
                ¿Eliminar el contenedor <strong>#{selectedContainer.id}</strong>?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => handleDelete(selectedContainer.id)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {deleting ? "Eliminando..." : "Si, eliminar"}
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={deleting}
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-60"
            >
              Eliminar ubicacion
            </button>
          )
        ) : null}
      </div>
    ) : null;

  const formPanel = (mode === "edit" || mode === "create") && (
    <div className="bg-white rounded-2xl shadow-sm p-4 border-2 border-[#2D6A4F]/40">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        {mode === "create"
          ? "Registrar nuevo contenedor"
          : `Editar contenedor #${selectedId}`}
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        {mode === "create"
          ? "Elige el tipo, haz clic en el mapa para la ubicacion y guarda."
          : "Cambia tipo, nombre o coordenadas. Usa el mapa para mover la ubicacion."}
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Tipo de contenedor</label>
          <div className="flex gap-2 mt-1">
            {(["verde", "naranja", "soterrado"] as ContainerTipo[]).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, tipo }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                  form.tipo === tipo
                    ? "text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
                style={
                  form.tipo === tipo
                    ? { backgroundColor: containerColor(tipo) }
                    : undefined
                }
              >
                {containerLabel(tipo)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600">Latitud</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  latitude: Number(e.target.value),
                }))
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Longitud</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  longitude: Number(e.target.value),
                }))
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Nombre (opcional)</label>
          <input
            type="text"
            value={form.nombre ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="Ej: Contenedor zona norte"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Estado operativo</label>
          <select
            value={form.estado ?? "activo"}
            onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value }))}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="activo">Activo</option>
            <option value="fuera_de_servicio">Fuera de servicio</option>
            <option value="lleno">Lleno</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">
            Capacidad actual: {form.nivel_llenado ?? 0}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={form.nivel_llenado ?? 0}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                nivel_llenado: Number(e.target.value),
              }))
            }
            className="w-full mt-2"
          />
        </div>

        <button
          type="button"
          onClick={() => setPickOnMap((value) => !value)}
          className={`w-full py-2 rounded-lg text-sm border transition ${
            pickOnMap
              ? "bg-green-50 border-green-400 text-green-800 font-medium"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {pickOnMap
            ? "Modo mapa activo: haz clic para ubicar"
            : "Elegir ubicacion en el mapa"}
        </button>

        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        {successMessage ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {successMessage}
          </p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex-1 py-2 bg-[#2D6A4F] hover:bg-[#1a4a35] text-white rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Guardando..." : mode === "create" ? "Registrar" : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={cancelForm}
            disabled={saving}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Mapa de Contenedores"
        description="Contenedores y mapa de calor de vertederos ilegales para que EMSA identifique zonas criticas y priorice incidentes"
        action={
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#1a4a35] text-white rounded-lg text-sm font-medium transition"
          >
            + Nuevo contenedor
          </button>
        }
      />

      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        loadingMessage="Cargando contenedores..."
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#2D6A4F]">
            <p className="text-2xl font-bold text-gray-800">
              {dbTotal ?? counts.total}
            </p>
            <p className="text-sm text-gray-500">Total contenedores</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <p className="text-2xl font-bold text-gray-800">{misContenedores.length}</p>
            <p className="text-sm text-gray-500">Mis registros</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <p className="text-2xl font-bold text-gray-800">{counts.verde}</p>
            <p className="text-sm text-gray-500">Verdes</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
            <p className="text-2xl font-bold text-gray-800">{counts.naranja}</p>
            <p className="text-sm text-gray-500">Naranjas</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <p className="text-2xl font-bold text-gray-800">{counts.soterrado}</p>
            <p className="text-sm text-gray-500">Soterrados</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border ${
                filtro === f.id
                  ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.id !== "todos" && (
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: f.color }}
                />
              )}
              {f.label}
            </button>
          ))}
        </div>

        <div className="mb-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Mapa de calor · Vertederos ilegales
              </h2>
              <p className="mt-1 text-sm text-gray-600 max-w-3xl">
                Visualiza las zonas con mayor concentracion y reincidencia de reportes para
                priorizar la atencion de incidentes segun frecuencia y ubicacion.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHeatmap((value) => !value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                showHeatmap
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-white border border-orange-300 text-orange-800 hover:bg-orange-100"
              }`}
            >
              {showHeatmap ? "Ocultar mapa de calor" : "Mostrar mapa de calor"}
            </button>
          </div>

          {showHeatmap ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setHeatmapScope("activos")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  heatmapScope === "activos"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Solo activos ({reportStats.activos})
              </button>
              <button
                type="button"
                onClick={() => setHeatmapScope("todos")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  heatmapScope === "todos"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Todos los reportes ({reportStats.total})
              </button>
              <span className="text-xs text-gray-500">
                {heatmapClusters.length} zona{heatmapClusters.length === 1 ? "" : "s"} ·{" "}
                {heatmapRenderPoints.length} reporte
                {heatmapRenderPoints.length === 1 ? "" : "s"}
              </span>
            </div>
          ) : null}

          {reportsError ? (
            <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {reportsError}{" "}
              <button
                type="button"
                onClick={reloadReports}
                className="underline font-medium"
              >
                Reintentar
              </button>
            </p>
          ) : null}
        </div>

        {containers.length === 0 && mode === "view" ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No hay contenedores cargados todavia. Usa <strong>+ Nuevo contenedor</strong> para
            registrar el primero o ejecuta el SQL de permisos en Supabase si ya existen datos.
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 flex flex-col h-[min(420px,62vh)] sm:h-[480px] lg:h-[560px] min-h-[320px] overflow-hidden">
              <div className="flex-1 min-h-0">
                <ContainersMap
                  containers={containers}
                  selectedId={selectedId}
                  pickOnMap={pickOnMap}
                  draftPosition={draftPosition}
                  layoutRevision={layoutRevision}
                  showHeatmap={showHeatmap}
                  heatPoints={heatmapRenderPoints}
                  onSelect={(id) => {
                    const container = containers.find((c) => c.id === id);
                    if (container) selectContainerFromMap(container);
                  }}
                  onMapClick={handleMapClick}
                />
              </div>
              {pickOnMap && (
                <p className="text-xs text-[#2D6A4F] mt-2 font-medium flex-shrink-0">
                  Haz clic en el mapa para colocar la ubicacion del contenedor
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-blue-100">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Mis ubicaciones registradas ({misContenedores.length})
                </h2>
              </div>

              {misContenedores.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-xl">
                  Aun no registraste ubicaciones. Usa <strong>+ Nuevo contenedor</strong> para agregar la primera.
                </p>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {misContenedores.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-xl border p-3 ${
                        selectedId === c.id
                          ? "border-[#2D6A4F] bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-800">#{c.id}</span>
                            <span
                              className="text-xs px-2 py-1 rounded-full text-white font-medium"
                              style={{ backgroundColor: containerColor(c.tipo) }}
                            >
                              {containerLabel(c.tipo)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatCoord(c.latitude)}, {formatCoord(c.longitude)}
                          </p>
                          {c.nombre ? (
                            <p className="text-xs text-gray-400 mt-1">{c.nombre}</p>
                          ) : null}
                        </button>

                        <div className="flex gap-2 sm:flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => startEdit(c)}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(c)}
                            className="px-3 py-2 text-sm border border-red-200 rounded-lg text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            ref={rightPanelRef}
            className="space-y-4 max-h-none lg:max-h-[560px] overflow-y-auto lg:sticky lg:top-6"
          >
            {selectedContainerPanel}
            {formPanel}

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Lista ({filtrados.length})
              </h2>
              <input
                type="text"
                placeholder="Buscar por #ID, nombre o tipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <div className="max-h-[420px] overflow-y-auto space-y-2">
                {filtrados.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No hay contenedores con este filtro.
                  </p>
                ) : (
                  filtrados.map((c) => {
                    const esMio = isMyContainer(c, sessionEmail);
                    return (
                      <div
                        key={c.id}
                        className={`rounded-xl border transition hover:shadow-sm ${
                          selectedId === c.id
                            ? "border-[#2D6A4F] bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectContainerFromMap(c)}
                          className="w-full text-left p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-800">#{c.id}</span>
                            <div className="flex items-center gap-1">
                              {esMio ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                  Mio
                                </span>
                              ) : null}
                              <span
                                className="text-xs px-2 py-1 rounded-full text-white font-medium"
                                style={{ backgroundColor: containerColor(c.tipo) }}
                              >
                                {containerLabel(c.tipo)}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatCoord(c.latitude)}, {formatCoord(c.longitude)}
                          </p>
                          {c.nombre ? (
                            <p className="text-xs text-gray-400 mt-1">{c.nombre}</p>
                          ) : null}
                        </button>
                        <div className="flex gap-2 px-3 pb-3">
                          <button
                            type="button"
                            onClick={() => startEdit(c)}
                            className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(c)}
                            className="flex-1 py-1.5 text-xs border border-red-200 rounded-lg text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </DataState>
    </>
  );
}
