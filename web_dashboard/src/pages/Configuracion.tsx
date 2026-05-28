import { useState } from 'react';

export default function Configuracion() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Configuracion</h1>
          <p className="text-gray-500 mb-6">Personaliza el panel de administracion</p>

          <div className="max-w-2xl space-y-5">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Notificaciones</h2>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">Alertas de contenedores llenos</p>
                  <p className="text-xs text-gray-400">Recibe una notificacion cuando un contenedor este al 80%</p>
                </div>
                <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition relative ${notifications ? 'bg-[#2D6A4F]' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition ${notifications ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">Nuevos reportes ciudadanos</p>
                  <p className="text-xs text-gray-400">Notificacion cuando llegue un reporte de vertedero</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-[#2D6A4F] relative">
                  <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-6" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Apariencia</h2>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">Modo oscuro</p>
                  <p className="text-xs text-gray-400">Cambia la interfaz a tema oscuro</p>
                </div>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition relative ${darkMode ? 'bg-[#2D6A4F]' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition ${darkMode ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Idioma</h2>
              <div className="grid grid-cols-2 gap-3">
                {[{ code: 'es', label: 'Espanol' }, { code: 'en', label: 'English' }].map(l => (
                  <button key={l.code} onClick={() => setLanguage(l.code)} className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${language === l.code ? 'border-[#2D6A4F] bg-green-50 text-[#2D6A4F]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informacion del Sistema</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between"><span>Versión</span><span className="font-medium text-gray-800">1.0.0</span></div>
                <div className="flex justify-between"><span>Backend URL</span><span className="font-medium text-gray-800">192.168.1.2:8000</span></div>
                <div className="flex justify-between"><span>Entorno</span><span className="font-medium text-gray-800">Desarrollo</span></div>
              </div>
            </div>
          </div>
    </>
  );
}
