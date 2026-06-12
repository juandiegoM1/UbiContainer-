import { ContainerRow, containerLabel } from "./containers";

export function normalizeContainerSearchQuery(raw: string) {
  return raw.trim().toLowerCase().replace(/^#+/, "");
}

export function matchesContainerSearch(
  container: ContainerRow,
  rawQuery: string
): boolean {
  const trimmed = rawQuery.trim();
  if (!trimmed) return true;

  const withHash = trimmed.startsWith("#");
  const q = normalizeContainerSearchQuery(trimmed);
  if (!q) return true;

  const idStr = String(container.id);

  if (withHash) {
    return idStr === q || idStr.startsWith(q);
  }

  if (idStr.includes(q) || `#${idStr}`.includes(trimmed.toLowerCase())) {
    return true;
  }

  const nombre = (container.nombre ?? "").toLowerCase();
  if (nombre.includes(q)) return true;

  const tipoLabel = containerLabel(container.tipo).toLowerCase();
  return tipoLabel.includes(q) || container.tipo.includes(q);
}
