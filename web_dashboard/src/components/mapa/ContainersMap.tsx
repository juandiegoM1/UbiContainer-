"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "@/api/mapboxConfig";
import {
  ContainerRow,
  ContainerTipo,
  containerColor,
} from "@/lib/containers";
import { HeatmapPoint } from "@/lib/dumpReportHeatmap";

type DraftPosition = {
  latitude: number;
  longitude: number;
  tipo: ContainerTipo;
};

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 30000,
};

type ContainersMapProps = {
  containers: ContainerRow[];
  selectedId: number | null;
  pickOnMap: boolean;
  draftPosition: DraftPosition | null;
  layoutRevision?: number;
  showHeatmap?: boolean;
  heatPoints?: HeatmapPoint[];
  onSelect: (id: number) => void;
  onMapClick: (latitude: number, longitude: number) => void;
};

export default function ContainersMap({
  containers,
  selectedId,
  pickOnMap,
  draftPosition,
  layoutRevision = 0,
  showHeatmap = false,
  heatPoints = [],
  onSelect,
  onMapClick,
}: ContainersMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapReadyRef = useRef(false);
  const userLocationWatchRef = useRef<number | null>(null);
  const userLocationPollRef = useRef<number | null>(null);
  const userCoordsRef = useRef<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const bestAccuracyRef = useRef<number | null>(null);
  const containersRef = useRef(containers);
  const prevShowHeatmapRef = useRef(showHeatmap);
  const prevHeatCountRef = useRef(0);
  const handlersRef = useRef({ onSelect, onMapClick, pickOnMap });
  const requestUserLocationRef = useRef<(fly?: boolean) => void>(() => undefined);
  const askedOnGestureRef = useRef(false);
  const [userLocationError, setUserLocationError] = useState<string | null>(null);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  function getSecureContextError(): string | null {
    if (typeof window === "undefined") return null;
    if (window.isSecureContext) return null;
    return "La ubicacion solo funciona en HTTPS o en http://localhost. Abre el dashboard desde localhost.";
  }
  function metersToPixels(meters: number, latitude: number, zoom: number) {
    const metersPerPixel =
      (40075016.686 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom + 9);
    if (!Number.isFinite(metersPerPixel) || metersPerPixel <= 0) return 16;
    return Math.max(10, Math.min(meters / metersPerPixel, 140));
  }

  function updateAccuracyHalo(map: mapboxgl.Map, latitude: number, accuracyMeters: number) {
    if (!map.getLayer("user-location-halo")) return;
    const radius = metersToPixels(accuracyMeters, latitude, map.getZoom());
    map.setPaintProperty("user-location-halo", "circle-radius", radius);
  }

  handlersRef.current = { onSelect, onMapClick, pickOnMap };
  containersRef.current = containers;

  function updateHeatmapData(map: mapboxgl.Map, points: HeatmapPoint[]) {
    const source = map.getSource("dump-reports-heat") as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          weight: point.weight,
          reportCount: point.reportCount,
        },
      })),
    });
  }

  function setHeatmapVisibility(map: mapboxgl.Map, visible: boolean) {
    for (const layerId of ["dump-reports-glow", "dump-reports-heatmap"]) {
      if (!map.getLayer(layerId)) continue;
      map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
    }

    if (map.getLayer("containers-circles")) {
      map.setPaintProperty("containers-circles", "circle-opacity", visible ? 0.35 : 1);
    }
  }

  function fitHeatmapBounds(map: mapboxgl.Map, points: HeatmapPoint[]) {
    if (points.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    for (const point of points) {
      bounds.extend([point.longitude, point.latitude]);
    }

    map.fitBounds(bounds, {
      padding: 100,
      maxZoom: points.length === 1 ? 15 : 14,
      duration: 900,
    });
  }

  function updateSourceData(map: mapboxgl.Map, items: ContainerRow[]) {
    const source = map.getSource("containers") as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features: items.map((c) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [c.longitude, c.latitude],
        },
        properties: {
          id: c.id,
          tipo: c.tipo,
          nombre: c.nombre ?? "",
        },
      })),
    });
  }

  function updateUserLocation(
    map: mapboxgl.Map,
    longitude: number,
    latitude: number,
    accuracyMeters: number
  ) {
    const source = map.getSource("user-location") as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          properties: {
            accuracy: accuracyMeters,
          },
        },
      ],
    });

    updateAccuracyHalo(map, latitude, accuracyMeters);
  }

  const shouldAcceptPosition = useCallback((accuracy: number) => {
    if (!userCoordsRef.current) return true;
    if (!Number.isFinite(accuracy) || accuracy <= 0) return true;
    if (bestAccuracyRef.current == null) return true;
    if (accuracy <= bestAccuracyRef.current + 12) return true;
    return accuracy <= 50;
  }, []);

  const applyUserLocation = useCallback(
    (
      map: mapboxgl.Map,
      latitude: number,
      longitude: number,
      accuracyMeters: number,
      fly = true
    ) => {
      userCoordsRef.current = { latitude, longitude, accuracy: accuracyMeters };
      if (Number.isFinite(accuracyMeters) && accuracyMeters > 0) {
        bestAccuracyRef.current =
          bestAccuracyRef.current == null
            ? accuracyMeters
            : Math.min(bestAccuracyRef.current, accuracyMeters);
      }
      setHasUserLocation(true);
      setUserLocationError(null);
      updateUserLocation(map, longitude, latitude, accuracyMeters);

      if (fly) {
        map.flyTo({
          center: [longitude, latitude],
          zoom: Math.max(map.getZoom(), 18),
          essential: true,
        });
      }
    },
    []
  );

  const processGeolocationPosition = useCallback(
    (map: mapboxgl.Map, position: GeolocationPosition, fly = false) => {
      const { latitude, longitude, accuracy } = position.coords;
      const safeAccuracy = Number.isFinite(accuracy) && accuracy > 0 ? accuracy : 25;

      if (!shouldAcceptPosition(safeAccuracy)) return;

      applyUserLocation(map, latitude, longitude, safeAccuracy, fly);
    },
    [applyUserLocation, shouldAcceptPosition]
  );

  const handleGeolocationError = useCallback(
    (error: GeolocationPositionError, silent = false) => {
      if (error.code === error.PERMISSION_DENIED && silent) return;

      setHasUserLocation(false);
      if (error.code === error.PERMISSION_DENIED) {
        setUserLocationError(
          "Permite la ubicacion en el navegador (icono de candado en la barra de direccion) y pulsa el boton azul."
        );
      } else if (error.code === error.TIMEOUT) {
        setUserLocationError("Tiempo agotado al obtener tu ubicacion. Intenta de nuevo");
      } else if (!silent) {
        setUserLocationError("No se pudo obtener tu ubicacion");
      }
    },
    []
  );

  const stopUserLocationPolling = useCallback(() => {
    if (userLocationPollRef.current != null) {
      window.clearInterval(userLocationPollRef.current);
      userLocationPollRef.current = null;
    }
  }, []);

  const startUserLocationPolling = useCallback(
    (map: mapboxgl.Map) => {
      if (!navigator.geolocation) return;
      stopUserLocationPolling();

      userLocationPollRef.current = window.setInterval(() => {
        if (document.visibilityState !== "visible") return;
        navigator.geolocation.getCurrentPosition(
          (position) => processGeolocationPosition(map, position, false),
          () => undefined,
          GEOLOCATION_OPTIONS
        );
      }, 2000);
    },
    [processGeolocationPosition, stopUserLocationPolling]
  );

  const startUserLocationWatch = useCallback(
    (map: mapboxgl.Map, options?: { silent?: boolean }) => {
      if (!navigator.geolocation) return;
      if (userLocationWatchRef.current != null) {
        navigator.geolocation.clearWatch(userLocationWatchRef.current);
      }

      userLocationWatchRef.current = navigator.geolocation.watchPosition(
        (position) => processGeolocationPosition(map, position, false),
        (error) => handleGeolocationError(error, options?.silent ?? false),
        GEOLOCATION_OPTIONS
      );

      startUserLocationPolling(map);
    },
    [handleGeolocationError, processGeolocationPosition, startUserLocationPolling]
  );

  const zoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 200 });
  }, []);

  const zoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 200 });
  }, []);

  const requestUserLocation = useCallback(
    (fly = true) => {
      const map = mapRef.current;
      if (!map || !mapReadyRef.current) {
        setUserLocationError("El mapa aun se esta cargando. Intenta en un momento");
        return;
      }

      const secureContextError = getSecureContextError();
      if (secureContextError) {
        setUserLocationError(secureContextError);
        return;
      }

      if (!navigator.geolocation) {
        setUserLocationError("Tu navegador no soporta geolocalizacion");
        return;
      }

      setIsLocating(true);
      setUserLocationError(null);

      if (!userCoordsRef.current) {
        bestAccuracyRef.current = null;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          processGeolocationPosition(map, position, fly);
          startUserLocationWatch(map);
        },
        (error) => {
          setIsLocating(false);
          handleGeolocationError(error);
        },
        GEOLOCATION_OPTIONS
      );
    },
    [handleGeolocationError, processGeolocationPosition, startUserLocationWatch]
  );

  requestUserLocationRef.current = requestUserLocation;

  const flyToUserLocation = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) {
      setUserLocationError("El mapa aun se esta cargando. Intenta en un momento");
      return;
    }

    if (userCoordsRef.current) {
      applyUserLocation(
        map,
        userCoordsRef.current.latitude,
        userCoordsRef.current.longitude,
        userCoordsRef.current.accuracy,
        true
      );
      if (userLocationWatchRef.current == null) {
        startUserLocationWatch(map);
      }
      return;
    }

    requestUserLocation(true);
  }, [applyUserLocation, requestUserLocation, startUserLocationWatch]);

  function updateDraftMarker(map: mapboxgl.Map, draft: DraftPosition | null) {
    const source = map.getSource("draft-point") as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    if (!draft) {
      source.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    source.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [draft.longitude, draft.latitude],
          },
          properties: { tipo: draft.tipo },
        },
      ],
    });
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!MAPBOX_TOKEN.trim()) {
      setUserLocationError(
        "Falta el token de Mapbox. Agrega NEXT_PUBLIC_MAPBOX_TOKEN en Vercel y vuelve a desplegar."
      );
      return;
    }

    let map: mapboxgl.Map;
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-66.1568, -17.3895],
        zoom: 12,
      });
    } catch (err) {
      setUserLocationError(
        err instanceof Error
          ? err.message
          : "No se pudo inicializar el mapa. Revisa el token de Mapbox en Vercel."
      );
      return;
    }

    mapRef.current = map;

    map.on("load", () => {
      mapReadyRef.current = true;

      map.addSource("dump-reports-heat", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addSource("containers", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addSource("draft-point", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addSource("user-location", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "dump-reports-glow",
        type: "circle",
        source: "dump-reports-heat",
        layout: {
          visibility: showHeatmap ? "visible" : "none",
        },
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            16,
            13,
            22,
            16,
            28,
          ],
          "circle-color": "rgba(251, 146, 60, 0.55)",
          "circle-blur": 0.75,
          "circle-opacity": 0.58,
        },
      });

      map.addLayer({
        id: "dump-reports-heatmap",
        type: "heatmap",
        source: "dump-reports-heat",
        layout: {
          visibility: showHeatmap ? "visible" : "none",
        },
        paint: {
          "heatmap-weight": 1,
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            1,
            12,
            1.6,
            15,
            2.1,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.08,
            "rgba(254, 243, 199, 0.38)",
            0.3,
            "rgba(253, 186, 116, 0.5)",
            0.55,
            "rgba(251, 146, 60, 0.58)",
            0.78,
            "rgba(248, 113, 113, 0.65)",
            1,
            "rgba(239, 68, 68, 0.72)",
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            20,
            12,
            28,
            15,
            36,
            18,
            42,
          ],
          "heatmap-opacity": 0.68,
        },
      });

      map.addLayer({
        id: "containers-circles",
        type: "circle",
        source: "containers",
        paint: {
          "circle-radius": [
            "case",
            ["==", ["get", "id"], selectedId ?? -1],
            9,
            6,
          ],
          "circle-color": [
            "match",
            ["get", "tipo"],
            "verde",
            containerColor("verde"),
            "naranja",
            containerColor("naranja"),
            "soterrado",
            containerColor("soterrado"),
            "#9ca3af",
          ],
          "circle-stroke-width": [
            "case",
            ["==", ["get", "id"], selectedId ?? -1],
            3,
            1,
          ],
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "draft-circle",
        type: "circle",
        source: "draft-point",
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "match",
            ["get", "tipo"],
            "verde",
            containerColor("verde"),
            "naranja",
            containerColor("naranja"),
            "soterrado",
            containerColor("soterrado"),
            "#9ca3af",
          ],
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "user-location-halo",
        type: "circle",
        source: "user-location",
        paint: {
          "circle-radius": 24,
          "circle-color": "#3b82f6",
          "circle-opacity": 0.18,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#60a5fa",
          "circle-stroke-opacity": 0.45,
        },
      });

      map.addLayer({
        id: "user-location-dot",
        type: "circle",
        source: "user-location",
        paint: {
          "circle-radius": 8,
          "circle-color": "#2563eb",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.on("click", "containers-circles", (event) => {
        if (handlersRef.current.pickOnMap) {
          handlersRef.current.onMapClick(
            event.lngLat.lat,
            event.lngLat.lng
          );
          return;
        }
        const feature = event.features?.[0];
        const id = feature?.properties?.id;
        if (id != null) {
          handlersRef.current.onSelect(Number(id));
        }
      });

      map.on("click", (event) => {
        if (!handlersRef.current.pickOnMap) return;
        handlersRef.current.onMapClick(event.lngLat.lat, event.lngLat.lng);
      });

      map.on("mouseenter", "containers-circles", () => {
        map.getCanvas().style.cursor = handlersRef.current.pickOnMap
          ? "crosshair"
          : "pointer";
      });

      map.on("mouseleave", "containers-circles", () => {
        map.getCanvas().style.cursor = handlersRef.current.pickOnMap
          ? "crosshair"
          : "";
      });

      updateHeatmapData(map, heatPoints);
      setHeatmapVisibility(map, showHeatmap);
      updateSourceData(map, containersRef.current);
      updateDraftMarker(map, draftPosition);

      const secureContextError = getSecureContextError();
      if (secureContextError) {
        setUserLocationError(secureContextError);
      } else {
        window.setTimeout(() => {
          requestUserLocationRef.current(false);
        }, 400);
      }

      map.on("zoom", () => {
        const coords = userCoordsRef.current;
        if (!coords) return;
        updateAccuracyHalo(map, coords.latitude, coords.accuracy);
      });
    });

    return () => {
      stopUserLocationPolling();
      if (userLocationWatchRef.current != null) {
        navigator.geolocation.clearWatch(userLocationWatchRef.current);
        userLocationWatchRef.current = null;
      }
      mapReadyRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, [startUserLocationWatch, stopUserLocationPolling]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;
    updateSourceData(map, containers);
  }, [containers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;
    updateHeatmapData(map, heatPoints);

    const heatCountChanged = heatPoints.length !== prevHeatCountRef.current;
    prevHeatCountRef.current = heatPoints.length;

    if (showHeatmap && heatPoints.length > 0 && heatCountChanged) {
      fitHeatmapBounds(map, heatPoints);
    }
  }, [heatPoints, showHeatmap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;
    setHeatmapVisibility(map, showHeatmap);

    const heatmapJustEnabled = showHeatmap && !prevShowHeatmapRef.current;
    if (heatmapJustEnabled && heatPoints.length > 0) {
      fitHeatmapBounds(map, heatPoints);
    }
    prevShowHeatmapRef.current = showHeatmap;
  }, [showHeatmap, heatPoints]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;
    updateDraftMarker(map, draftPosition);
  }, [draftPosition]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;
    if (map.getLayer("containers-circles")) {
      map.setPaintProperty("containers-circles", "circle-radius", [
        "case",
        ["==", ["get", "id"], selectedId ?? -1],
        9,
        6,
      ]);
      map.setPaintProperty("containers-circles", "circle-stroke-width", [
        "case",
        ["==", ["get", "id"], selectedId ?? -1],
        3,
        1,
      ]);
    }
  }, [selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = pickOnMap ? "crosshair" : "";
  }, [pickOnMap]);

  useEffect(() => {
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container || !mapReadyRef.current) return;

    const resize = () => {
      map.resize();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const frame = requestAnimationFrame(resize);
    const timer = window.setTimeout(resize, 200);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [layoutRevision, pickOnMap]);

  if (!MAPBOX_TOKEN.trim()) {
    return (
      <div className="flex h-full min-h-[440px] w-full flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-semibold text-amber-900">Mapa no disponible</p>
        <p className="mt-2 max-w-md text-sm text-amber-800">
          Falta configurar <code className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> en las
          variables de entorno de Vercel.
        </p>
        <p className="mt-2 text-xs text-amber-700">
          Despues de guardarla, Vercel pedira redesplegar el proyecto.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative h-full min-h-[440px] w-full overflow-hidden rounded-xl isolate ${
        pickOnMap ? "ring-2 ring-[#2D6A4F] ring-offset-2" : ""
      }`}
    >
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0 h-full w-full"
        onClick={() => {
          if (askedOnGestureRef.current || hasUserLocation || isLocating) return;
          askedOnGestureRef.current = true;
          requestUserLocationRef.current(false);
        }}
      />
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="pointer-events-auto absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          <button
            type="button"
            onClick={zoomIn}
            title="Acercar mapa"
            aria-label="Acercar mapa"
            className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-gray-700 transition hover:bg-gray-50 border-b border-gray-200"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomOut}
            title="Alejar mapa"
            aria-label="Alejar mapa"
            className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            −
          </button>
        </div>
        <button
          type="button"
          onClick={flyToUserLocation}
          disabled={isLocating}
          title="Ir a mi ubicacion"
          aria-label="Ir a mi ubicacion"
          className={`pointer-events-auto absolute bottom-[5.75rem] right-3 flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-md transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70 ${
            hasUserLocation ? "border-blue-200 text-blue-600" : "border-gray-200 text-gray-500"
          }`}
        >
          {isLocating ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </svg>
          )}
        </button>
      </div>
      {showHeatmap ? (
        <div className="absolute bottom-3 left-3 z-20 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-700">Mapa de calor · reportes reales</p>
          <div className="mt-1.5 flex h-2 w-36 overflow-hidden rounded-full opacity-80">
            <span className="flex-1 bg-amber-100" />
            <span className="flex-1 bg-orange-200" />
            <span className="flex-1 bg-orange-300" />
            <span className="flex-1 bg-red-300" />
          </div>
          <p className="mt-1 text-[10px] text-gray-500">Poca concentracion → Mas reportes en la zona</p>
        </div>
      ) : null}
      {!hasUserLocation && !isLocating && !userLocationError ? (
        <p className="pointer-events-none absolute top-3 left-1/2 z-30 max-w-[320px] -translate-x-1/2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-center text-xs text-blue-800 shadow-sm">
          Obteniendo tu ubicacion... Si no aparece, pulsa el boton azul o permite el acceso en el navegador.
        </p>
      ) : null}
      {userLocationError ? (
        <p className="pointer-events-auto absolute top-3 left-1/2 z-30 max-w-[340px] -translate-x-1/2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-800 shadow-sm">
          {userLocationError}
        </p>
      ) : null}
    </div>
  );
}
