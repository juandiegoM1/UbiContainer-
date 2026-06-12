import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase_config";

const DUMP_REPORTS_BUCKET = "dump-reports";

export type DumpReportRow = {
  id: number | string;
  user_id: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  photo_path: string | null;
  photo_url?: string | null;
  estado: "pendiente" | "en_proceso" | "atendido";
  created_at: string;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function isLocalDevicePath(photoPath: string) {
  return (
    photoPath.startsWith("/") ||
    photoPath.startsWith("file:") ||
    photoPath.includes(":\\") ||
    photoPath.includes("/data/user/")
  );
}

export async function getDumpReportPhotoUrl(
  photoPath: string | null
): Promise<string | null> {
  if (!photoPath) return null;
  if (photoPath.startsWith("http")) return photoPath;
  if (isLocalDevicePath(photoPath)) return null;

  const normalizedPath = photoPath.replace(/^\/+/, "");

  const { data: signed, error: signedError } = await supabase.storage
    .from(DUMP_REPORTS_BUCKET)
    .createSignedUrl(normalizedPath, 60 * 60);

  if (!signedError && signed?.signedUrl) {
    return signed.signedUrl;
  }

  const { data: publicData } = supabase.storage
    .from(DUMP_REPORTS_BUCKET)
    .getPublicUrl(normalizedPath);

  return publicData.publicUrl;
}

export async function fetchDumpReports(): Promise<DumpReportRow[]> {
  const { data, error } = await supabase
    .from("reportes_vertederos")
    .select(
      "id, user_id, latitude, longitude, description, photo_path, estado, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateDumpReportEstado(
  id: number | string,
  estado: DumpReportRow["estado"]
): Promise<DumpReportRow["estado"]> {
  const { data, error } = await supabase
    .from("reportes_vertederos")
    .update({ estado })
    .eq("id", id)
    .select("id, estado")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error(
      "No se pudo actualizar el estado. Ejecuta el SQL de permisos de reportes en Supabase."
    );
  }

  return data.estado as DumpReportRow["estado"];
}
