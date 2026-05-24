import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const reports = [
  { id: 1, tipo: 'Vertedero Ilegal', ubicacion: 'Av. America y Calle 23', hora: '15 min ago', estado: 'Pendiente', foto: true },
  { id: 2, tipo: 'Contenedor Danado', ubicacion: 'Plaza Colon', hora: '42 min ago', estado: 'En Proceso', foto: false },
  { id: 3, tipo: 'Vertedero Ilegal', ubicacion: 'Calle Sucre esq. Bolivar', hora: '1 h ago', estado: 'Pendiente', foto: true },
  { id: 4, tipo: 'Contenedor Lleno', ubicacion: 'Parque de la Familia', hora: '2 h ago', estado: 'Atendido', foto: false },
  { id: 5, tipo: 'Vertedero Ilegal', ubicacion: 'Av. Blanco Galindo km 4', hora: '3 h ago', estado: 'Pendiente', foto: true },
  { id: 6, tipo: 'Contenedor Danado', ubicacion: 'Av. Heroinas y Ayacucho', hora: '5 h ago', estado: 'En Proceso', foto: false },
  { id: 7, tipo: 'Contenedor Lleno', ubicacion: 'Av. Petrolera', hora: '8 h ago', estado: 'Atendido', foto: false },
];

const estadoFiltros = ['Todos', 'Pendiente', 'En Proceso', 'Atendido'];

export default function Reportes() {
  const [filtro, setFiltro] = useState('Todos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const filtrados = filtro === 'Todos' ? reports : reports.filter(r => r.estado === filtro);
  const pendientes = reports.filter(r => r.estado === 'Pendiente').length;
  const enProceso = reports.filter(r => r.estado === 'En Proceso').length;
  const atendidos = reports.filter(r => r.estado === 'Atendido').length;

  const handleLogout = () => navigate('/');

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Contenedores', path: '/contenedores', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Mapa', path: '/mapa', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Reportes', path: '/reportes', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Configuracion', path: '/configuracion', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#2D6A4F] to-[#1a4a35] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {sidebarOpen && <span className="font-bold text-lg">UbiContainer</span>}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <a key={item.label} onClick={() => navigate(item.path)} className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition ${item.label === 'Reportes' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10'}`}>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reportes de Contenedores</h1>
          <p className="text-gray-500 mb-6">Gestion de reportes ciudadanos y estado de contenedores</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-yellow-500">
              <p className="text-3xl font-bold text-gray-800">{pendientes}</p>
              <p className="text-sm text-gray-500 mt-1">Pendientes</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-blue-500">
              <p className="text-3xl font-bold text-gray-800">{enProceso}</p>
              <p className="text-sm text-gray-500 mt-1">En Proceso</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-500">
              <p className="text-3xl font-bold text-gray-800">{atendidos}</p>
              <p className="text-sm text-gray-500 mt-1">Atendidos</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {estadoFiltros.map(e => (
              <button
                key={e}
                onClick={() => setFiltro(e)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filtro === e ? 'bg-[#2D6A4F] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Ubicacion</th>
                  <th className="px-6 py-3 font-medium">Hora</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{r.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.ubicacion}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.hora}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        r.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>{r.estado}</span>
                    </td>
                    <td className="px-6 py-4">
                      {r.foto ? (
                        <span className="text-xs text-[#2D6A4F] font-medium bg-green-50 px-2 py-1 rounded">Adjunta</span>
                      ) : (
                        <span className="text-xs text-gray-400">Sin foto</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtrados.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">No hay reportes con ese filtro.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
