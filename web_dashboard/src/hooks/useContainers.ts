"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ContainerRow,
  ContainerTipo,
  fetchContainers,
  fetchContainersCount,
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
    tipo: (record.tipo as ContainerTipo) ?? "naranja",
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

export function useContainers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containers, setContainers] = useState<ContainerRow[]>([]);
  const [dbTotal, setDbTotal] = useState<number | null>(null);
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
        const [data, total] = await Promise.all([
          fetchContainers(),
          fetchContainersCount(),
        ]);
        if (!cancelled) {
          setContainers(data);
          setDbTotal(total);
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
              new: (payload.new ?? {}) as Record<string, unknown>,
              old: (payload.old ?? {}) as Record<string, unknown>,
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

  return { loading, error, containers, dbTotal, reload, setContainers };
}
