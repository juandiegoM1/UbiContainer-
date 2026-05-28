"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  demoCredentials,
  findCredential,
  saveSession,
  type DemoCredential,
} from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const credential = findCredential(email, password);
    if (!credential) {
      setError("Credenciales incorrectas. Usa una cuenta demo de la izquierda.");
      return;
    }

    saveSession(credential);
    router.push("/dashboard");
  };

  const fillDemoCredential = (credential: DemoCredential) => {
    setEmail(credential.email);
    setPassword(credential.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D6A4F] to-[#1a4a35] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl grid lg:grid-cols-2">
        <div className="bg-[#f4f8f6] p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-[#2D6A4F] uppercase">Sistema web</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Gestion inteligente de contenedores urbanos</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Ingresa con una cuenta demo para revisar el dashboard segun tu rol: administrador, gerente u operador.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-8">
            {demoCredentials.map((credential) => (
              <button
                key={credential.email}
                type="button"
                onClick={() => fillDemoCredential(credential)}
                className={`text-left rounded-2xl border-2 p-4 hover:shadow-md transition ${credential.accent}`}
              >
                <p className="font-semibold text-gray-800">{credential.roleLabel}</p>
                <p className="text-xs text-gray-500 mt-1">{credential.description}</p>
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Email:</span> {credential.email}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Clave:</span> {credential.password}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2D6A4F] to-[#6B4F2A] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">UbiContainer</h1>
            <p className="text-gray-500 mt-2">Panel de Administracion</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-yellow-800">Acceso demo disponible</p>
            <p className="text-xs text-yellow-700 mt-1">
              Puedes usar cualquier tarjeta de la izquierda para rellenar el formulario automaticamente.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition"
                placeholder="********"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2D6A4F] to-[#1a4a35] text-white py-3 rounded-xl font-semibold hover:from-[#3a8a65] hover:to-[#2D6A4F] transition shadow-lg"
            >
              Iniciar Sesion
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Olvidaste tu contrasena?{" "}
            <a href="#" className="text-[#2D6A4F] hover:underline font-medium">
              Recuperar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
