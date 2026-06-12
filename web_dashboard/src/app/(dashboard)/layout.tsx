"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  canAccessPath,
  clearSession,
  getAllowedPaths,
  getSession,
  type AuthSession,
} from "@/lib/auth";
import { clearToken } from "@/lib/api";
import { applySettings, loadSettings } from "@/lib/settings";

type NavItem = {
  label: string;
  path: string;
  icon: string;
};

const allNavItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  },
  {
    label: "Contenedores",
    path: "/contenedores",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    label: "Mapa",
    path: "/mapa",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    label: "Alertas",
    path: "/alertas",
    icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  },
  {
    label: "Configuracion",
    path: "/configuracion",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    applySettings(loadSettings());

    const currentSession = getSession();
    if (!currentSession) {
      router.replace("/");
      return;
    }

    setSession(currentSession);

    if (!canAccessPath(currentSession.role, pathname)) {
      const fallback = getAllowedPaths(currentSession.role)[0] ?? "/dashboard";
      router.replace(fallback);
    }
  }, [pathname, router]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncLayout = () => {
      const desktop = mediaQuery.matches;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };

    syncLayout();
    mediaQuery.addEventListener("change", syncLayout);
    return () => mediaQuery.removeEventListener("change", syncLayout);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [pathname, isDesktop]);

  const handleLogout = () => {
    clearSession();
    clearToken();
    router.push("/");
  };

  const showNavLabels = !isDesktop || sidebarOpen;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando sesion...</p>
      </div>
    );
  }

  const navItems = allNavItems.filter((item) => canAccessPath(session.role, item.path));

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {!isDesktop && sidebarOpen ? (
        <button
          type="button"
          aria-label="Cerrar menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen flex flex-col flex-shrink-0 overflow-hidden bg-gradient-to-b from-[#2D6A4F] to-[#1a4a35] text-white transition-all duration-300 w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isDesktop && !sidebarOpen ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          {showNavLabels ? <span className="font-bold text-lg">UbiContainer</span> : null}
        </div>
        <nav className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                router.push(item.path);
                if (!isDesktop) setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition w-full text-left ${
                pathname === item.path ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {showNavLabels ? <span>{item.label}</span> : null}
            </button>
          ))}
        </nav>
        <div className="p-3 sm:p-4 border-t border-white/10 flex-shrink-0 bg-[#1a4a35]/40">
          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesion"
            aria-label="Cerrar sesion"
            className={`flex items-center gap-3 rounded-xl text-white bg-red-600 hover:bg-red-700 transition w-full ${
              showNavLabels ? "px-3 py-3 justify-start" : "p-3 justify-center"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {showNavLabels ? <span className="font-medium">Cerrar Sesion</span> : null}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label={sidebarOpen ? "Cerrar menu" : "Abrir menu"}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="text-right hidden sm:block min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                {session.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{session.roleLabel}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-[#2D6A4F] to-[#6B4F2A] rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {session.initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
