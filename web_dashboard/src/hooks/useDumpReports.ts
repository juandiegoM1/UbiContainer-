"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DumpReportRow,
  fetchDumpReports,
  getDumpReportPhotoUrl,
  supabase,
} from "@/lib/supabase";

async function attachPhotoUrls(reports: DumpReportRow[]): Promise<DumpReportRow[]> {
  return Promise.all(
    reports.map(async (report) => ({
      ...report,
      photo_url: await getDumpReportPhotoUrl(report.photo_path),
    }))
  );
}

function normalizeReport(record: Record<string, unknown>): DumpReportRow | null {
  const latitude = Number(record.latitude);
  const longitude = Number(record.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (record.id == null) return null;

  return {
    id: record.id as number | string,
    user_id: (record.user_id as string | null) ?? null,
    latitude,
    longitude,
    description: (record.description as string | null) ?? null,
    photo_path: (record.photo_path as string | null) ?? null,
    estado: (record.estado as DumpReportRow["estado"]) ?? "pendiente",
    created_at: (record.created_at as string) ?? new Date().toISOString(),
  };
}

export function useDumpReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<DumpReportRow[]>([]);
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
        const data = await fetchDumpReports();
        const withPhotos = await attachPhotoUrls(data);
        if (!cancelled) {
          setReports(withPhotos);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los reportes"
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
      .channel("reportes-vertederos-realtime-web")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reportes_vertederos",
        },
        async (payload) => {
          const record = normalizeReport(
            (payload.new ?? {}) as Record<string, unknown>
          );
          if (!record) return;

          const photo_url = await getDumpReportPhotoUrl(record.photo_path);
          setReports((current) => {
            if (current.some((item) => String(item.id) === String(record.id))) {
              return current;
            }
            return [{ ...record, photo_url }, ...current];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reportes_vertederos",
        },
        (payload) => {
          const record = normalizeReport(
            (payload.new ?? {}) as Record<string, unknown>
          );
          if (!record) return;

          setReports((current) =>
            current.map((item) =>
              String(item.id) === String(record.id) ? { ...item, ...record } : item
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "reportes_vertederos",
        },
        (payload) => {
          const oldRecord = payload.old as { id?: number | string } | null;
          if (oldRecord?.id == null) return;

          setReports((current) =>
            current.filter((item) => String(item.id) !== String(oldRecord.id))
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [reloadKey]);

  return { loading, error, reports, reload, setReports };
}
