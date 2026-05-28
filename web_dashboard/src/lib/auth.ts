export type UserRole = "administrador" | "operador" | "gerente";

export type DemoCredential = {
  role: UserRole;
  roleLabel: string;
  email: string;
  password: string;
  description: string;
  accent: string;
  initials: string;
};

export type AuthSession = {
  email: string;
  role: UserRole;
  roleLabel: string;
  initials: string;
};

const SESSION_KEY = "ubicontainer_session";

export const demoCredentials: DemoCredential[] = [
  {
    role: "administrador",
    roleLabel: "Administrador",
    email: "admin@ubicontainer.com",
    password: "123456",
    description: "Acceso completo al panel de control",
    accent: "border-[#2D6A4F] bg-[#2D6A4F]/5",
    initials: "AD",
  },
  {
    role: "gerente",
    roleLabel: "Gerente",
    email: "gerente@ubicontainer.com",
    password: "123456",
    description: "Supervision de indicadores y reportes",
    accent: "border-[#1e4d7b] bg-[#1e4d7b]/5",
    initials: "GE",
  },
  {
    role: "operador",
    roleLabel: "Operador",
    email: "operador@ubicontainer.com",
    password: "123456",
    description: "Revision de rutas y contenedores",
    accent: "border-[#6B4F2A] bg-[#6B4F2A]/5",
    initials: "OP",
  },
];

const rolePermissions: Record<UserRole, string[]> = {
  administrador: ["/dashboard", "/contenedores", "/mapa", "/reportes", "/configuracion"],
  gerente: ["/dashboard", "/mapa", "/reportes"],
  operador: ["/dashboard", "/contenedores", "/mapa", "/reportes"],
};

export function getAllowedPaths(role: UserRole): string[] {
  return rolePermissions[role];
}

export function canAccessPath(role: UserRole, path: string): boolean {
  return getAllowedPaths(role).includes(path);
}

export function findCredential(email: string, password: string): DemoCredential | null {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    demoCredentials.find(
      (credential) =>
        credential.email.toLowerCase() === normalizedEmail && credential.password === password
    ) ?? null
  );
}

export function saveSession(credential: DemoCredential): AuthSession {
  const session: AuthSession = {
    email: credential.email,
    role: credential.role,
    roleLabel: credential.roleLabel,
    initials: credential.initials,
  };
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
