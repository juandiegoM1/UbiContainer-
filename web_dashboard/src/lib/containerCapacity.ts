import { ContainerRow } from "./containers";

export const CAPACITY_ALERT_THRESHOLD = 70;

export type CapacityKind =
  | "empty"
  | "partial"
  | "warning"
  | "full"
  | "out_of_service";

export type ContainerCapacityStatus = {
  label: string;
  color: string;
  nivel: number;
  isAlert: boolean;
  kind: CapacityKind;
};

export function normalizeCapacity(nivel: number | null | undefined): number {
  const parsed = Number(nivel ?? 0);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, Math.round(parsed)));
}

export function getContainerCapacityStatus(
  container: Pick<ContainerRow, "nivel_llenado" | "estado">
): ContainerCapacityStatus {
  const estado = (container.estado ?? "activo").toLowerCase();
  const nivel = normalizeCapacity(container.nivel_llenado);

  if (estado === "fuera_de_servicio") {
    return {
      label: "Fuera de servicio",
      color: "#6b7280",
      nivel,
      isAlert: false,
      kind: "out_of_service",
    };
  }

  if (estado === "lleno" || nivel >= 100) {
    return {
      label: "Lleno",
      color: "#dc2626",
      nivel: Math.max(nivel, 100),
      isAlert: true,
      kind: "full",
    };
  }

  if (nivel >= CAPACITY_ALERT_THRESHOLD) {
    return {
      label: `Por llenarse (${nivel}%)`,
      color: "#f97316",
      nivel,
      isAlert: true,
      kind: "warning",
    };
  }

  if (nivel === 0) {
    return {
      label: "Vacio",
      color: "#22c55e",
      nivel,
      isAlert: false,
      kind: "empty",
    };
  }

  return {
    label: `${nivel}% de capacidad`,
    color: "#3b82f6",
    nivel,
    isAlert: false,
    kind: "partial",
  };
}

export function isCapacityAlert(
  container: Pick<ContainerRow, "nivel_llenado" | "estado">
): boolean {
  return getContainerCapacityStatus(container).isAlert;
}

export function getCapacityAlerts(containers: ContainerRow[]): ContainerRow[] {
  return containers
    .filter(isCapacityAlert)
    .sort(
      (a, b) =>
        normalizeCapacity(b.nivel_llenado) - normalizeCapacity(a.nivel_llenado)
    );
}
