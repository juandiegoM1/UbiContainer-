import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAPBOX_TOKEN } from '../api/mapboxToken';

const containers = [
  { id: 'N-001', lat: -17.3895, lon: -66.1568, type: 'Naranja', zone: 'Zona Norte', status: 'Lleno' },
  { id: 'V-042', lat: -17.3840, lon: -66.1600, type: 'Verde', zone: 'Zona Sur', status: 'OK' },
  { id: 'S-012', lat: -17.3950, lon: -66.1500, type: 'Soterrado', zone: 'Zona Este', status: 'Mantenimiento' },
  { id: 'N-103', lat: -17.3800, lon: -66.1650, type: 'Naranja', zone: 'Zona Oeste', status: 'Lleno' },
  { id: 'V-089', lat: -17.3920, lon: -66.1550, type: 'Verde', zone: 'Zona Centro', status: 'OK' },
  { id: 'S-005', lat: -17.3850, lon: -66.1585, type: 'Soterrado', zone: 'Zona Norte', status: 'OK' },
];

export default function Mapa() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12.html?` +
    `title=true&zoomwheel=true&access_token=${MAPBOX_TOKEN}#12.5/-17.3895/-66.1568`;

  const handleLogout = () => navigate('/');

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#2D6A4F] to-[#1a4a35] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {sidebarOpen && <span className="font-bold text-lg">UbiContainer</span>}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { label: 'Mapa', path: '/mapa', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Reportes', path: '/reportes', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { label: 'Configuracion', path: '/configuracion', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
          ].map(item => (
            <a key={item.label} onClick={() => navigate(item.path)} className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition ${item.label === 'Mapa' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10'}`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-white/10 transition w-full">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Cerrar Sesion</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-br from-[#2D6A4F] to-[#6B4F2A] rounded-full flex items-center justify-center text-white text-sm font-semibold">JT</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Mapa de Contenedores</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-4 h-[480px]">
                <iframe
                  src={mapUrl}
                  className="w-full h-full rounded-xl border-0"
                  title="Mapa UbiContainer"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Contenedores ({containers.length})</h2>
              {containers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                  className={`w-full text-left p-4 rounded-xl border transition hover:shadow-md ${selected === c.id ? 'border-[#2D6A4F] bg-green-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{c.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      c.status === 'Lleno' ? 'bg-red-100 text-red-700' :
                      c.status === 'Mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{c.type} &bull; {c.zone}</p>
                  {selected === c.id && (
                    <p className="text-xs text-gray-400 mt-2">Lat: {c.lat}, Lon: {c.lon}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
