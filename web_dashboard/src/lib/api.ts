import { API_BASE_URL } from "@/api/config";

export type Container = {
  id: string;
  latitude: number;
  longitude: number;
  type: "naranja" | "verde" | "soterrado";
  name?: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type ReportPayload = {
  latitude: number;
  longitude: number;
  description?: string;
  container_id?: number;
};

let authToken: string | null = null;

export function setToken(token: string) {
  authToken = token;
}

export function clearToken() {
  authToken = null;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
}

export async function fetchContainers(): Promise<Container[]> {
  const res = await fetch(`${API_BASE_URL}/containers`);
  if (!res.ok) throw new Error("Error al cargar contenedores");
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });

  if (!res.ok) throw new Error("Credenciales incorrectas");
  const data: LoginResponse = await res.json();
  setToken(data.access_token);
  return data;
}

export async function createReport(payload: ReportPayload): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/report`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al enviar reporte");
  return res.json();
}

export async function createDumpReport(
  latitude: number,
  longitude: number,
  description?: string,
  photo?: File
): Promise<{ message: string }> {
  const form = new FormData();
  form.append("latitude", String(latitude));
  form.append("longitude", String(longitude));
  if (description) form.append("description", description);
  if (photo) form.append("photo", photo);

  const res = await fetch(`${API_BASE_URL}/dump-reports`, {
    method: "POST",
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    body: form,
  });

  if (!res.ok) throw new Error("Error al enviar reporte de vertedero");
  return res.json();
}
