import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D6A4F] to-[#1a4a35] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition" placeholder="tu@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contrasena</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition" placeholder="********" required />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-[#2D6A4F] to-[#1a4a35] text-white py-3 rounded-xl font-semibold hover:from-[#3a8a65] hover:to-[#2D6A4F] transition shadow-lg">Iniciar Sesion</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Olvidaste tu contrasena? <a href="#" className="text-[#2D6A4F] hover:underline font-medium">Recuperar</a></p>
      </div>
    </div>
  );
}