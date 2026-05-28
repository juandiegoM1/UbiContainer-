import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contenedores from './pages/Contenedores';
import Mapa from './pages/Mapa';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contenedores" element={<Contenedores />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;