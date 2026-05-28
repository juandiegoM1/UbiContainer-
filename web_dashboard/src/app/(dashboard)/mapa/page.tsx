"use client";

import { useState } from "react";
import { MAPBOX_TOKEN } from "@/api/mapboxToken";

const containers = [
  { id: "N-001", lat: -17.3895, lon: -66.1568, type: "Naranja", zone: "Zona Norte", status: "Lleno" },
  { id: "V-042", lat: -17.3840, lon: -66.1600, type: "Verde", zone: "Zona Sur", status: "OK" },
  { id: "S-012", lat: -17.3950, lon: -66.1500, type: "Soterrado", zone: "Zona Este", status: "Mantenimiento" },
  { id: "N-103", lat: -17.3800, lon: -66.1650, type: "Naranja", zone: "Zona Oeste", status: "Lleno" },
  { id: "V-089", lat: -17.3920, lon: -66.1550, type: "Verde", zone: "Zona Centro", status: "OK" },
  { id: "S-005", lat: -17.3850, lon: -66.1585, type: "Soterrado", zone: "Zona Norte", status: "OK" },
];

export default function MapaPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12.html?` +
    `title=true&zoomwheel=true&access_token=${MAPBOX_TOKEN}#12.5/-17.3895/-66.1568`;

  return (
    <>
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
              className={`w-full text-left p-4 rounded-xl border transition hover:shadow-md ${selected === c.id ? "border-[#2D6A4F] bg-green-50" : "border-gray-200 bg-white"}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{c.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  c.status === "Lleno" ? "bg-red-100 text-red-700" :
                  c.status === "Mantenimiento" ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
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
    </>
  );
}
