import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../estilos/Principal.css'; // opcional para estilos específicos

export default function Principal() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="principal-contenido">
        <h1>¿Qué quieres hacer?</h1>
        <div className="botones-principales">
          <button onClick={() => navigate('/crear-playlist')}>Crear Playlist</button>
          <button onClick={() => navigate('/unirse-playlist')}>Unirse a Playlist</button>
        </div>
      </div>
    </div>
  );
}
