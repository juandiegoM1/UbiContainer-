import { ContainerRow } from "./containers";

const STORAGE_KEY = "ubicontainer_mis_contenedores";

type Registry = Record<string, number[]>;

function readRegistry(): Registry {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Registry;
  } catch {
    return {};
  }
}

function writeRegistry(registry: Registry) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
}

export function registerMyContainer(email: string, id: number) {
  const registry = readRegistry();
  const key = email.trim().toLowerCase();
  const ids = new Set(registry[key] ?? []);
  ids.add(id);
  registry[key] = [...ids].sort((a, b) => a - b);
  writeRegistry(registry);
}

export function unregisterMyContainer(email: string, id: number) {
  const registry = readRegistry();
  const key = email.trim().toLowerCase();
  registry[key] = (registry[key] ?? []).filter((itemId) => itemId !== id);
  writeRegistry(registry);
}

export function getMyContainerIds(email: string | null): number[] {
  if (!email) return [];
  return readRegistry()[email.trim().toLowerCase()] ?? [];
}

export function isMyContainer(
  container: ContainerRow,
  email: string | null
): boolean {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  if (container.creado_por?.trim().toLowerCase() === normalizedEmail) {
    return true;
  }

  return getMyContainerIds(email).includes(container.id);
}
