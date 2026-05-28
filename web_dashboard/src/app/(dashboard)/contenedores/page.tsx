"use client";

import { useMemo, useState } from "react";

type EstadoContenedor = "OK" | "Lleno" | "Mantenimiento";
type TipoContenedor = "Naranja" | "Verde" | "Soterrado";

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
  { id: "N-001", tipo: "Naranja", zona: "Zona Norte", estado: "Lleno", capacidad: 92, ultimaActualizacion: "Hace 2h", responsable: "Ruta Norte" },
  { id: "V-042", tipo: "Verde", zona: "Zona Sur", estado: "OK", capacidad: 38, ultimaActualizacion: "Hace 5h", responsable: "Ruta Sur" },
  { id: "S-012", tipo: "Soterrado", zona: "Zona Este", estado: "Mantenimiento", capacidad: 64, ultimaActualizacion: "Hace 1d", responsable: "Equipo Tecnico" },
  { id: "N-103", tipo: "Naranja", zona: "Zona Oeste", estado: "Lleno", capacidad: 88, ultimaActualizacion: "Hace 3h", responsable: "Ruta Oeste" },
  { id: "V-089", tipo: "Verde", zona: "Zona Centro", estado: "OK", capacidad: 41, ultimaActualizacion: "Hace 8h", responsable: "Ruta Centro" },
  { id: "S-005", tipo: "Soterrado", zona: "Zona Norte", estado: "OK", capacidad: 52, ultimaActualizacion: "Hace 6h", responsable: "Ruta Norte" },
  { id: "N-118", tipo: "Naranja", zona: "Zona Sudeste", estado: "OK", capacidad: 47, ultimaActualizacion: "Hace 4h", responsable: "Ruta Sudeste" },
  { id: "V-074", tipo: "Verde", zona: "Zona Central", estado: "Mantenimiento", capacidad: 71, ultimaActualizacion: "Hace 12h", responsable: "Equipo Tecnico" },
];

const tipos = ["Todos", "Naranja", "Verde", "Soterrado"];
const estados = ["Todos", "OK", "Lleno", "Mantenimiento"];

export default function ContenedoresPage() {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [estado, setEstado] = useState("Todos");

  const filtrados = useMemo(() => {
    return contenedores.filter(c => {
      const coincideTexto = `${c.id} ${c.zona} ${c.responsable}`.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = tipo === "Todos" || c.tipo === tipo;
      const coincideEstado = estado === "Todos" || c.estado === estado;
      return coincideTexto && coincideTipo && coincideEstado;
    });
  }, [busqueda, tipo, estado]);

  const llenos = contenedores.filter(c => c.estado === "Lleno").length;
  const mantenimiento = contenedores.filter(c => c.estado === "Mantenimiento").length;
  const operativos = contenedores.filter(c => c.estado === "OK").length;

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Contenedores</h1>
      <p className="text-gray-500 mb-6">Gestion y monitoreo de contenedores urbanos</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-500">
          <p className="text-3xl font-bold text-gray-800">{operativos}</p>
          <p className="text-sm text-gray-500 mt-1">Operativos</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-red-500">
          <p className="text-3xl font-bold text-gray-800">{llenos}</p>
          <p className="text-sm text-gray-500 mt-1">Llenos</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-yellow-500">
          <p className="text-3xl font-bold text-gray-800">{mantenimiento}</p>
          <p className="text-sm text-gray-500 mt-1">Mantenimiento</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar contenedor..." className="px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
        {tipos.map(t => (
          <button key={t} onClick={() => setTipo(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tipo === t ? "bg-[#2D6A4F] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>{t}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {estados.map(e => (
          <button key={e} onClick={() => setEstado(e)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${estado === e ? "bg-[#2D6A4F] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>{e}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Tipo</th>
              <th className="px-6 py-3 font-medium">Zona</th>
              <th className="px-6 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 font-medium">Capacidad</th>
              <th className="px-6 py-3 font-medium">Responsable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrados.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{c.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.tipo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.zona}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.estado === "Lleno" ? "bg-red-100 text-red-700" :
                    c.estado === "Mantenimiento" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>{c.estado}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.capacidad}%</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">No hay contenedores con ese filtro.</div>
        )}
      </div>
    </>
  );
}
