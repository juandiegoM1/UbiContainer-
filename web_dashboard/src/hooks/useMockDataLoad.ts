"use client";

import { useCallback, useEffect, useState } from "react";

type UseMockDataLoadOptions = {
  delayMs?: number;
};

export function useMockDataLoad<T>(data: T, options?: UseMockDataLoadOptions) {
  const delayMs = options?.delayMs ?? 650;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedData, setLoadedData] = useState<T | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setLoadedData(null);

    const timer = setTimeout(() => {
      if (cancelled) return;
      setLoadedData(data);
      setLoading(false);
    }, delayMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [data, delayMs, reloadKey]);

  return { loading, error, data: loadedData, reload };
}
