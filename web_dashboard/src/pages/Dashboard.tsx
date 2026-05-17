import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const stats = [
    { label: 'Contenedores Totales', value: '248', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'from-[#2D6A4F] to-[#3a8a65]' },
    { label: 'Contenedores Llenos', value: '37', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z', color: 'from-red-500 to-red-600' },
    { label: 'Reportes Hoy', value: '12', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'from-[#6B4F2A] to-[#8B6F3A]' },
    { label: 'Sensores Activos', value: '215', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z', color: 'from-blue-500 to-blue-600' },
  ];

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
          <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/15 text-white">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-white/10 transition">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {sidebarOpen && <span>Mapa</span>}
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-white/10 transition">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarOpen && <span>Reportes</span>}
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-white/10 transition">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {sidebarOpen && <span>Configuracion</span>}
          </a>
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
            <div className="w-9 h-9 bg-gradient-to-br from-[#2D6A4F] to-[#6B4F2A] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              JT
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Estado de Contenedores</h2>
              <div className="space-y-4">
                {[
                  { zona: 'Zona Norte', llenos: 12, total: 62, color: 'bg-[#2D6A4F]' },
                  { zona: 'Zona Sur', llenos: 8, total: 58, color: 'bg-[#2D6A4F]' },
                  { zona: 'Zona Este', llenos: 10, total: 55, color: 'bg-[#2D6A4F]' },
                  { zona: 'Zona Oeste', llenos: 7, total: 73, color: 'bg-[#2D6A4F]' },
                ].map((z, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{z.zona}</span>
                      <span className="text-gray-400">{z.llenos}/{z.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`${z.color} h-2.5 rounded-full`} style={{ width: `${(z.llenos / z.total) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ultimos Reportes</h2>
              <div className="space-y-3">
                {[
                  { tipo: 'Vertedero Ilegal', ubicacion: 'Av. America y Calle 23', hora: 'Hace 15 min', estado: 'Pendiente' },
                  { tipo: 'Contenedor Danado', ubicacion: 'Plaza Colon', hora: 'Hace 42 min', estado: 'En Proceso' },
                  { tipo: 'Vertedero Ilegal', ubicacion: 'Calle Sucre esq. Bolivar', hora: 'Hace 1 hora', estado: 'Pendiente' },
                  { tipo: 'Contenedor Lleno', ubicacion: 'Parque de la Familia', hora: 'Hace 2 horas', estado: 'Atendido' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.tipo}</p>
                      <p className="text-xs text-gray-400">{r.ubicacion} • {r.hora}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                      r.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>{r.estado}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}