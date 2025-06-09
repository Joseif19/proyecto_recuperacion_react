import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginFormulario from './componentes/LoginFormulario';
import RegistroFormulario from './componentes/RegistroFormulario';
import Principal from './componentes/Principal';
import Perfil from './componentes/Perfil';
import CrearPlaylist from './componentes/CrearPlaylist';
import UnirsePlaylist from './componentes/UnirsePlaylist';

export default function RouterApp() {
  return (
    <Routes>
      <Route path="/login" element={<LoginFormulario />} />
      <Route path="/registro" element={<RegistroFormulario />} />
      <Route path="/principal" element={<Principal />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/crear-playlist" element={<CrearPlaylist />} />
      <Route path="/unirse-playlist" element={<UnirsePlaylist />} />
      {/* Si la ruta no existe, redirige a login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
