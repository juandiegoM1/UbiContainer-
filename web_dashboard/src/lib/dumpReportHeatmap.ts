import { DumpReportRow } from "./supabase";

export type HeatmapPoint = {
  latitude: number;
  longitude: number;
  weight: number;
  reportCount: number;
  pendientes: number;
  enProceso: number;
  atendidos: number;
};

export type HeatmapScope = "todos" | "activos";

/** ~55 m: agrupa reportes en la misma zona sin perder la ubicacion exacta. */
const CLUSTER_GRID_FACTOR = 2000;

function toCoordinate(value: number | string) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function snapCoordinate(value: number, factor = CLUSTER_GRID_FACTOR) {
  return Math.round(value * factor) / factor;
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

function filterReports(reports: DumpReportRow[], scope: HeatmapScope) {
  return reports.filter((report) => {
    const latitude = toCoordinate(report.latitude);
    const longitude = toCoordinate(report.longitude);
    if (!isValidCoordinate(latitude, longitude)) return false;
    if (scope === "activos") {
      return report.estado === "pendiente" || report.estado === "en_proceso";
    }
    return true;
  });
}

function clusterReports(reports: DumpReportRow[], scope: HeatmapScope) {
  const grid = new Map<
    string,
    {
      latitudeSum: number;
      longitudeSum: number;
      reportCount: number;
      pendientes: number;
      enProceso: number;
      atendidos: number;
    }
  >();

  for (const report of filterReports(reports, scope)) {
    const latitude = toCoordinate(report.latitude);
    const longitude = toCoordinate(report.longitude);
    const snappedLat = snapCoordinate(latitude);
    const snappedLon = snapCoordinate(longitude);
    const key = `${snappedLat},${snappedLon}`;
    const cell = grid.get(key);

    if (cell) {
      cell.latitudeSum += latitude;
      cell.longitudeSum += longitude;
      cell.reportCount += 1;
      if (report.estado === "pendiente") cell.pendientes += 1;
      else if (report.estado === "en_proceso") cell.enProceso += 1;
      else cell.atendidos += 1;
    } else {
      grid.set(key, {
        latitudeSum: latitude,
        longitudeSum: longitude,
        reportCount: 1,
        pendientes: report.estado === "pendiente" ? 1 : 0,
        enProceso: report.estado === "en_proceso" ? 1 : 0,
        atendidos: report.estado === "atendido" ? 1 : 0,
      });
    }
  }

  return Array.from(grid.values()).map((cell) => ({
    latitude: cell.latitudeSum / cell.reportCount,
    longitude: cell.longitudeSum / cell.reportCount,
    weight: cell.reportCount,
    reportCount: cell.reportCount,
    pendientes: cell.pendientes,
    enProceso: cell.enProceso,
    atendidos: cell.atendidos,
  }));
}

/** Puntos para el mapa: ubicacion promedio de cada zona con peso = cantidad de reportes. */
export function buildHeatmapPoints(
  reports: DumpReportRow[],
  scope: HeatmapScope = "todos"
): HeatmapPoint[] {
  return clusterReports(reports, scope);
}

/** Un punto por reporte: el mapa de calor acumula densidad en la ubicacion exacta. */
export function buildHeatmapRenderPoints(
  reports: DumpReportRow[],
  scope: HeatmapScope = "todos"
): HeatmapPoint[] {
  return filterReports(reports, scope).map((report) => ({
    latitude: toCoordinate(report.latitude),
    longitude: toCoordinate(report.longitude),
    weight: 1,
    reportCount: 1,
    pendientes: report.estado === "pendiente" ? 1 : 0,
    enProceso: report.estado === "en_proceso" ? 1 : 0,
    atendidos: report.estado === "atendido" ? 1 : 0,
  }));
}

export function getTopHotspots(points: HeatmapPoint[], limit = 5): HeatmapPoint[] {
  return [...points].sort((a, b) => b.reportCount - a.reportCount).slice(0, limit);
}
