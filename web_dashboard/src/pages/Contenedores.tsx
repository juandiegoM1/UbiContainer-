import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type EstadoContenedor = 'OK' | 'Lleno' | 'Mantenimiento';
type TipoContenedor = 'Naranja' | 'Verde' | 'Soterrado';

type Contenedor = {
  id: string;
  tipo: TipoContenedor;
  zona: string;
  estado: EstadoContenedor;
  capacidad: number;
  ultimaActualizacion: string;
  responsable: string;
};

const contenedores: Contenedor[] = [
  { id: 'N-001', tipo: 'Naranja', zona: 'Zona Norte', estado: 'Lleno', capacidad: 92, ultimaActualizacion: 'Hace 2h', responsable: 'Ruta Norte' },
  { id: 'V-042', tipo: 'Verde', zona: 'Zona Sur', estado: 'OK', capacidad: 38, ultimaActualizacion: 'Hace 5h', responsable: 'Ruta Sur' },
  { id: 'S-012', tipo: 'Soterrado', zona: 'Zona Este', estado: 'Mantenimiento', capacidad: 64, ultimaActualizacion: 'Hace 1d', responsable: 'Equipo Tecnico' },
  { id: 'N-103', tipo: 'Naranja', zona: 'Zona Oeste', estado: 'Lleno', capacidad: 88, ultimaActualizacion: 'Hace 3h', responsable: 'Ruta Oeste' },
  { id: 'V-089', tipo: 'Verde', zona: 'Zona Centro', estado: 'OK', capacidad: 41, ultimaActualizacion: 'Hace 8h', responsable: 'Ruta Centro' },
  { id: 'S-005', tipo: 'Soterrado', zona: 'Zona Norte', estado: 'OK', capacidad: 52, ultimaActualizacion: 'Hace 6h', responsable: 'Ruta Norte' },
  { id: 'N-118', tipo: 'Naranja', zona: 'Zona Sudeste', estado: 'OK', capacidad: 47, ultimaActualizacion: 'Hace 4h', responsable: 'Ruta Sudeste' },
  { id: 'V-074', tipo: 'Verde', zona: 'Zona Central', estado: 'Mantenimiento', capacidad: 71, ultimaActualizacion: 'Hace 12h', responsable: 'Equipo Tecnico' },
];

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { label: 'Contenedores', path: '/contenedores', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { label: 'Mapa', path: '/mapa', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Reportes', path: '/reportes', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Configuracion', path: '/configuracion', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

const tipos = ['Todos', 'Naranja', 'Verde', 'Soterrado'];
const estados = ['Todos', 'OK', 'Lleno', 'Mantenimiento'];

export default function Contenedores() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const navigate = useNavigate();
  const location = useLocation();

  const filtrados = useMemo(() => {
    return contenedores.filter(c => {
      const coincideTexto = `${c.id} ${c.zona} ${c.responsable}`.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = tipo === 'Todos' || c.tipo === tipo;
      const coincideEstado = estado === 'Todos' || c.estado === estado;
      return coincideTexto && coincideTipo && coincideEstado;
    });
  }, [busqueda, tipo, estado]);

  const llenos = contenedores.filter(c => c.estado === 'Lleno').length;
  const mantenimiento = contenedores.filter(c => c.estado === 'Mantenimiento').length;
  const operativos = contenedores.filter(c => c.estado === 'OK').length;

  const handleLogout = () => navigate('/');

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
            <a key={item.label} onClick={() => navigate(item.path)} className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition ${location.pathname === item.path ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10'}`}>
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
          <div className="w-9 h-9 bg-gradient-to-br from-[#2D6A4F] to-[#6B4F2A] rounded-full flex items-center justify-center text-white text-sm font-semibold">JT</div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Contenedores</h1>
              <p className="text-gray-500 mt-1">Control operativo de contenedores por zona, tipo y estado</p>
            </div>
            <button className="bg-[#2D6A4F] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#24543f] transition shadow-sm">
              Registrar contenedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-[#2D6A4F]">
              <p className="text-3xl font-bold text-gray-800">{contenedores.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total registrados</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-red-500">
              <p className="text-3xl font-bold text-gray-800">{llenos}</p>
              <p className="text-sm text-gray-500 mt-1">Llenos</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-yellow-500">
              <p className="text-3xl font-bold text-gray-800">{mantenimiento}</p>
              <p className="text-sm text-gray-500 mt-1">Mantenimiento</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-500">
              <p className="text-3xl font-bold text-gray-800">{operativos}</p>
              <p className="text-sm text-gray-500 mt-1">Operativos</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F]" placeholder="Buscar por codigo, zona o ruta" />
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white">
                {tipos.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={estado} onChange={(e) => setEstado(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white">
                {estados.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Codigo</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Zona</th>
                  <th className="px-6 py-3 font-medium">Capacidad</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Responsable</th>
                  <th className="px-6 py-3 font-medium">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{c.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.zona}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className={`${c.capacidad >= 80 ? 'bg-red-500' : c.capacidad >= 60 ? 'bg-yellow-500' : 'bg-[#2D6A4F]'} h-2 rounded-full`} style={{ width: `${c.capacidad}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{c.capacidad}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.estado === 'Lleno' ? 'bg-red-100 text-red-700' : c.estado === 'Mantenimiento' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{c.estado}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.responsable}</td>
                    <td className="px-6 py-4">
                      <button className="text-sm font-medium text-[#2D6A4F] hover:underline">Ver detalle</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtrados.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No se encontraron contenedores con esos filtros.</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
