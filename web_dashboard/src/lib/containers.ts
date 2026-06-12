import { supabase } from "./supabase";

export type ContainerTipo = "naranja" | "verde" | "soterrado";

export type ContainerRow = {
  id: number;
  tipo: ContainerTipo;
  latitude: number;
  longitude: number;
  nombre: string | null;
  cantidad: number | null;
  estado: string | null;
  nivel_llenado: number | null;
  creado_por: string | null;
};

export type ContainerInput = {
  tipo: ContainerTipo;
  latitude: number;
  longitude: number;
  nombre?: string | null;
  cantidad?: number;
  estado?: string | null;
  nivel_llenado?: number | null;
  creado_por?: string | null;
};

const SELECT_WITH_CREATOR =
  "id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado, creado_por";
const SELECT_BASE =
  "id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado";

function isMissingCreadoPorColumn(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("creado_por") || isSchemaColumnError(message, "creado_por")
  );
}

function isMissingNivelLlenadoColumn(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("nivel_llenado") ||
    lower.includes("nivel llenado") ||
    isSchemaColumnError(message, "nivel_llenado")
  );
}

function isSchemaColumnError(message: string, column: string) {
  const lower = message.toLowerCase();
  return lower.includes(column.toLowerCase()) && lower.includes("schema cache");
}

function buildSelect(includeNivelLlenado: boolean, includeCreadoPor: boolean) {
  const fields = [
    "id",
    "tipo",
    "latitude",
    "longitude",
    "nombre",
    "cantidad",
    "estado",
  ];
  if (includeNivelLlenado) fields.push("nivel_llenado");
  if (includeCreadoPor) fields.push("creado_por");
  return fields.join(", ");
}

function buildWritePayload(
  input: ContainerInput,
  options: { includeNivelLlenado: boolean; includeCreadoPor: boolean }
) {
  const payload: Record<string, unknown> = {
    tipo: input.tipo,
    latitude: input.latitude,
    longitude: input.longitude,
    nombre: input.nombre ?? null,
    cantidad: input.cantidad ?? 1,
    estado: input.estado ?? "activo",
  };

  if (options.includeNivelLlenado) {
    payload.nivel_llenado = input.nivel_llenado ?? 0;
  }
  if (options.includeCreadoPor) {
    payload.creado_por = input.creado_por ?? null;
  }

  return payload;
}

function shouldRetryWithoutColumn(message: string, column: "nivel_llenado" | "creado_por") {
  if (column === "nivel_llenado") {
    return isMissingNivelLlenadoColumn(message) || isSchemaColumnError(message, "nivel_llenado");
  }
  return isMissingCreadoPorColumn(message) || isSchemaColumnError(message, "creado_por");
}

async function fetchNextContainerId(): Promise<number> {
  const { data, error } = await supabase
    .from("contenedores")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  const maxId = data?.[0]?.id;
  return (typeof maxId === "number" ? maxId : 0) + 1;
}

function normalizeContainerRow(row: Record<string, unknown>): ContainerRow {
  return {
    id: row.id as number,
    tipo: row.tipo as ContainerTipo,
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    nombre: (row.nombre as string | null) ?? null,
    cantidad: (row.cantidad as number | null) ?? null,
    estado: (row.estado as string | null) ?? null,
    nivel_llenado: (row.nivel_llenado as number | null) ?? 0,
    creado_por: (row.creado_por as string | null | undefined) ?? null,
  };
}

async function fetchWithSelect(select: string): Promise<ContainerRow[]> {
  const pageSize = 1000;
  let from = 0;
  const allRows: ContainerRow[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("contenedores")
      .select(select)
      .order("id")
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);

    const batch = (data ?? []).map((row) =>
      normalizeContainerRow(row as Record<string, unknown>)
    );
    allRows.push(...batch);

    if (batch.length < pageSize) break;
    from += pageSize;
  }

  return allRows;
}

const SELECT_MINIMAL =
  "id, tipo, latitude, longitude, nombre, cantidad, estado";

export async function fetchContainersCount(): Promise<number> {
  const { count, error } = await supabase
    .from("contenedores")
    .select("id", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchContainers(): Promise<ContainerRow[]> {
  const attempts = [
    SELECT_WITH_CREATOR,
    SELECT_BASE,
    `${SELECT_MINIMAL}, creado_por`,
    SELECT_MINIMAL,
  ];

  let lastError: string | null = null;

  for (const select of attempts) {
    try {
      const rows = await fetchWithSelect(select);
      if (rows.length > 0) return rows;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Error desconocido";
    }
  }

  throw new Error(lastError ?? "No se pudieron cargar los contenedores");
}

export async function createContainer(
  input: ContainerInput
): Promise<ContainerRow> {
  const nextId = await fetchNextContainerId();
  const attempts: Array<{ includeNivelLlenado: boolean; includeCreadoPor: boolean }> = [
    { includeNivelLlenado: true, includeCreadoPor: true },
    { includeNivelLlenado: true, includeCreadoPor: false },
    { includeNivelLlenado: false, includeCreadoPor: true },
    { includeNivelLlenado: false, includeCreadoPor: false },
  ];

  let lastError: string | null = null;

  for (const attempt of attempts) {
    const { data, error } = await supabase
      .from("contenedores")
      .insert({
        id: nextId,
        ...buildWritePayload(input, {
          includeNivelLlenado: attempt.includeNivelLlenado,
          includeCreadoPor: attempt.includeCreadoPor,
        }),
      })
      .select(
        buildSelect(attempt.includeNivelLlenado, attempt.includeCreadoPor)
      )
      .single();

    if (!error && data) {
      return normalizeContainerRow(data as Record<string, unknown>);
    }

    if (!error) continue;

    lastError = error.message;
    const retry =
      (attempt.includeNivelLlenado &&
        shouldRetryWithoutColumn(error.message, "nivel_llenado")) ||
      (attempt.includeCreadoPor &&
        shouldRetryWithoutColumn(error.message, "creado_por"));

    if (!retry) {
      throw new Error(error.message);
    }
  }

  throw new Error(lastError ?? "No se pudo crear el contenedor");
}

export async function deleteContainer(id: number): Promise<void> {
  const { error } = await supabase.from("contenedores").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateContainer(
  id: number,
  input: ContainerInput
): Promise<ContainerRow> {
  const attempts: Array<{ includeNivelLlenado: boolean; includeCreadoPor: boolean }> = [
    { includeNivelLlenado: true, includeCreadoPor: true },
    { includeNivelLlenado: true, includeCreadoPor: false },
    { includeNivelLlenado: false, includeCreadoPor: true },
    { includeNivelLlenado: false, includeCreadoPor: false },
  ];

  let lastError: string | null = null;

  for (const attempt of attempts) {
    const payload = buildWritePayload(input, {
      includeNivelLlenado:
        attempt.includeNivelLlenado && input.nivel_llenado != null,
      includeCreadoPor: false,
    });

    const { data, error } = await supabase
      .from("contenedores")
      .update(payload)
      .eq("id", id)
      .select(
        buildSelect(attempt.includeNivelLlenado, attempt.includeCreadoPor)
      )
      .single();

    if (!error && data) {
      return normalizeContainerRow(data as Record<string, unknown>);
    }

    if (!error) continue;

    lastError = error.message;
    const retry =
      (attempt.includeNivelLlenado &&
        shouldRetryWithoutColumn(error.message, "nivel_llenado")) ||
      (attempt.includeCreadoPor &&
        shouldRetryWithoutColumn(error.message, "creado_por"));

    if (!retry) {
      throw new Error(error.message);
    }
  }

  throw new Error(lastError ?? "No se pudo actualizar el contenedor");
}

export function containerColor(tipo: ContainerTipo): string {
  switch (tipo) {
    case "verde":
      return "#22c55e";
    case "naranja":
      return "#f97316";
    case "soterrado":
      return "#ef4444";
    default:
      return "#9ca3af";
  }
}

export function containerLabel(tipo: ContainerTipo): string {
  switch (tipo) {
    case "verde":
      return "Verde";
    case "naranja":
      return "Naranja";
    case "soterrado":
      return "Soterrado";
    default:
      return tipo;
  }
}
