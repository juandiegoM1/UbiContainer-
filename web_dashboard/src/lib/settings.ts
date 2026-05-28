export type AppSettings = {
  alertsFullContainers: boolean;
  alertsCitizenReports: boolean;
  darkMode: boolean;
  language: "es" | "en";
};

const STORAGE_KEY = "ubicontainer_settings";

export const defaultSettings: AppSettings = {
  alertsFullContainers: true,
  alertsCitizenReports: true,
  darkMode: false,
  language: "es",
};

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  applySettings(settings);
}

export function applySettings(settings: AppSettings): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", settings.darkMode);
  document.documentElement.lang = settings.language;
}

export function resetSettings(): AppSettings {
  saveSettings(defaultSettings);
  return defaultSettings;
}
