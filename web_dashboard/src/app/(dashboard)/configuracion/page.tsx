"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/api/config";
import { LoadingState, PageHeader } from "@/components/ui";
import {
  applySettings,
  defaultSettings,
  loadSettings,
  resetSettings,
  saveSettings,
  type AppSettings,
} from "@/lib/settings";

function Toggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition relative ${enabled ? "bg-[#2D6A4F]" : "bg-gray-300"}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition ${enabled ? "left-6" : "left-0.5"}`}
      />
    </button>
  );
}

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [ready, setReady] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    applySettings(stored);
    setReady(true);
  }, []);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    const restored = resetSettings();
    setSettings(restored);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  if (!ready) {
    return (
      <>
        <PageHeader title="Configuracion" description="Personaliza el panel de administracion" />
        <LoadingState message="Cargando preferencias..." />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Configuracion"
        description="Tus preferencias se guardan en este navegador"
        action={
          savedNotice ? (
            <span className="text-sm font-medium text-[#2D6A4F] bg-green-50 px-3 py-1.5 rounded-lg">
              Cambios guardados
            </span>
          ) : null
        }
      />

      <div className="max-w-2xl space-y-5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Notificaciones</h2>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Alertas de contenedores llenos</p>
              <p className="text-xs text-gray-400">Aviso cuando un contenedor este al 80%</p>
            </div>
            <Toggle
              label="Alertas de contenedores llenos"
              enabled={settings.alertsFullContainers}
              onChange={() => updateSettings({ alertsFullContainers: !settings.alertsFullContainers })}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Nuevos reportes ciudadanos</p>
              <p className="text-xs text-gray-400">Aviso cuando llegue un reporte de vertedero</p>
            </div>
            <Toggle
              label="Nuevos reportes ciudadanos"
              enabled={settings.alertsCitizenReports}
              onChange={() => updateSettings({ alertsCitizenReports: !settings.alertsCitizenReports })}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Apariencia</h2>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Modo oscuro</p>
              <p className="text-xs text-gray-400">Tema oscuro en el panel (basico)</p>
            </div>
            <Toggle
              label="Modo oscuro"
              enabled={settings.darkMode}
              onChange={() => updateSettings({ darkMode: !settings.darkMode })}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Idioma</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { code: "es" as const, label: "Espanol" },
              { code: "en" as const, label: "English" },
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => updateSettings({ language: l.code })}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${
                  settings.language === l.code
                    ? "border-[#2D6A4F] bg-green-50 dark:bg-green-900/30 text-[#2D6A4F]"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Informacion del Sistema</h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">1.0.0</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Backend URL</span>
              <span className="font-medium text-gray-800 dark:text-gray-100 text-right break-all">{API_BASE_URL}</span>
            </div>
            <div className="flex justify-between">
              <span>Entorno</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">Desarrollo</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          Restaurar valores por defecto
        </button>
      </div>
    </>
  );
}
