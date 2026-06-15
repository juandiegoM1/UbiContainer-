"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ContainerRow,
  ContainerStats,
  ContainerTipo,
  fetchContainerStats,
  fetchContainers,
  normalizeContainerTipo,
} from "@/lib/containers";
import { supabase } from "@/lib/supabase";

function sortContainers(rows: ContainerRow[]) {
  return [...rows].sort((a, b) => a.id - b.id);
}

function normalizeRealtimeRow(record: Record<string, unknown>): ContainerRow | null {
  const id = Number(record.id);
  const latitude = Number(record.latitude);
  const longitude = Number(record.longitude);
  if (!Number.isFinite(id) || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    id,
    tipo: normalizeContainerTipo(record.tipo) ?? "naranja",
    latitude,
    longitude,
    nombre: (record.nombre as string | null) ?? null,
    cantidad: (record.cantidad as number | null) ?? null,
    estado: (record.estado as string | null) ?? null,
    nivel_llenado: (record.nivel_llenado as number | null) ?? 0,
    creado_por: (record.creado_por as string | null) ?? null,
  };
}

function applyRealtimeChange(
  current: ContainerRow[],
  payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new: Record<string, unknown>;
    old: Record<string, unknown>;
  }
): ContainerRow[] {
  if (payload.eventType === "INSERT") {
    const row = normalizeRealtimeRow(payload.new);
    if (!row) return current;
    if (current.some((item) => item.id === row.id)) {
      return current.map((item) => (item.id === row.id ? { ...item, ...row } : item));
    }
    return sortContainers([...current, row]);
  }

  if (payload.eventType === "UPDATE") {
    const row = normalizeRealtimeRow(payload.new);
    if (!row) return current;
    return current.map((item) => (item.id === row.id ? { ...item, ...row } : item));
  }

  if (payload.eventType === "DELETE") {
    const id = Number(payload.old.id);
    if (!Number.isFinite(id)) return current;
    return current.filter((item) => item.id !== id);
  }

  return current;
}

function applyRealtimeStats(
  current: ContainerStats,
  payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new: Record<string, unknown>;
    old: Record<string, unknown>;
  }
): ContainerStats {
  const next = { ...current };

  if (payload.eventType === "INSERT") {
    const tipo = normalizeContainerTipo(payload.new.tipo);
    if (!tipo) return current;
    next.total += 1;
    next.units += 1;
    next[tipo] += 1;
    return next;
  }

  if (payload.eventType === "DELETE") {
    const tipo = normalizeContainerTipo(payload.old.tipo);
    if (!tipo) return current;
    next.total = Math.max(0, next.total - 1);
    next.units = Math.max(0, next.units - 1);
    next[tipo] = Math.max(0, next[tipo] - 1);
    return next;
  }

  if (payload.eventType === "UPDATE") {
    const previousTipo = normalizeContainerTipo(payload.old.tipo);
    const nextTipo = normalizeContainerTipo(payload.new.tipo);
    if (!previousTipo || !nextTipo || previousTipo === nextTipo) return current;
    next[previousTipo] = Math.max(0, next[previousTipo] - 1);
    next[nextTipo] += 1;
  }

  return next;
}

export function useContainers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containers, setContainers] = useState<ContainerRow[]>([]);
  const [stats, setStats] = useState<ContainerStats>({
    total: 0,
    verde: 0,
    naranja: 0,
    soterrado: 0,
    units: 0,
  });
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [data, serverStats] = await Promise.all([
          fetchContainers(),
          fetchContainerStats(),
        ]);
        if (!cancelled) {
          setContainers(data);
          setStats(serverStats);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los contenedores"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    const channel = supabase
      .channel("contenedores-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contenedores" },
        (payload) => {
          if (cancelled) return;
          setContainers((current) =>
            applyRealtimeChange(current, {
              eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
              new: (payload.new ?? {}) as unknown as Record<string, unknown>,
              old: (payload.old ?? {}) as unknown as Record<string, unknown>,
            })
          );
          setStats((current) =>
            applyRealtimeStats(current, {
              eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
              new: (payload.new ?? {}) as unknown as Record<string, unknown>,
              old: (payload.old ?? {}) as unknown as Record<string, unknown>,
            })
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [reloadKey]);

  return { loading, error, containers, stats, reload, setContainers };
}
