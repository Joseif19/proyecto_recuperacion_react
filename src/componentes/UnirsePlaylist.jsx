import React, { useEffect, useState, useContext } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import BotonVolver from './BotonVolver';

export default function UnirsePlaylist() {
  const { user } = useContext(UserContext);
  const [playlists, setPlaylists] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const { data } = await axios.get('http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/playlists');
        setPlaylists(data);
      } catch (err) {
        setError('No se pudieron cargar las playlists.');
      }
    }
    fetchPlaylists();
  }, []);

  // Permite quitar una playlist de la lista (puedes llamarla desde Perfil.jsx si usas contexto)
  const quitarPlaylist = (id) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  // Si quieres exponer quitarPlaylist para usarla desde fuera:
  // window.quitarPlaylistGlobal = quitarPlaylist;

  const playlistsFiltradas = playlists.filter(
    (p) =>
      p.publica !== false &&
      (!busqueda ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase())))
  );

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #181818 0%, #232323 100%)',
          paddingTop: 110,
          paddingBottom: 40,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h1 style={{
            color: '#1db954',
            fontSize: 38,
            fontWeight: 'bold',
            marginBottom: 10,
            marginTop: 10,
            letterSpacing: 1,
            textAlign: 'center'
          }}>
            ¡Únete a una Playlist!
          </h1>
          <p style={{
            color: '#fff',
            fontSize: 20,
            marginBottom: 36,
            textAlign: 'center',
            maxWidth: 600
          }}>
            Únete a tus playlists favoritas creadas por el resto de usuarios y comparte la mejor música.
          </p>
          <input
            type="text"
            placeholder="Buscar playlist por nombre o descripción..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 400,
              padding: '12px 18px',
              borderRadius: 10,
              border: '1.5px solid #1db954',
              fontSize: 18,
              background: '#232323',
              color: '#fff',
              marginBottom: 36,
              outline: 'none'
            }}
          />
          {error && <p style={{ color: '#ff3b3b', marginBottom: 24 }}>{error}</p>}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 32,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {playlistsFiltradas.length === 0 && (
              <p style={{ color: '#b3b3b3', fontSize: 20, marginTop: 40 }}>No hay playlists públicas disponibles.</p>
            )}
            {playlistsFiltradas.map((playlist) => (
              <div
                key={playlist.id}
                style={{
                  background: 'rgba(34,34,34,0.98)',
                  borderRadius: 16,
                  boxShadow: '0 4px 24px #000a',
                  padding: '32px 28px',
                  minWidth: 260,
                  maxWidth: 320,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.15s',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                title="Ver detalles de la playlist"
              >
                <img
                  src={playlist.imagenUrl || '/imagenes/perfil1.png'}
                  alt="Portada"
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 14,
                    objectFit: 'cover',
                    marginBottom: 18,
                    border: '2.5px solid #1db954',
                    boxShadow: '0 2px 12px #1db95433'
                  }}
                />
                <h3 style={{
                  color: '#1db954',
                  fontWeight: 'bold',
                  fontSize: 22,
                  marginBottom: 8,
                  textAlign: 'center'
                }}>
                  {playlist.nombre}
                </h3>
                <p style={{
                  color: '#fff',
                  fontSize: 16,
                  marginBottom: 12,
                  textAlign: 'center',
                  minHeight: 40,
                  maxHeight: 60,
                  overflow: 'hidden'
                }}>
                  {playlist.descripcion || 'Sin descripción'}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Botón volver abajo y centrado */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <BotonVolver texto="Volver" />
        </div>
      </div>
      <style>
        {`
          @media (max-width: 900px) {
            div[style*="max-width: 1100px"] {
              padding: 0 4vw !important;
            }
            div[style*="minWidth: 260px"] {
              min-width: 98vw !important;
              max-width: 98vw !important;
            }
          }
          @media (max-width: 600px) {
            h1 {
              font-size: 24px !important;
            }
            p {
              font-size: 16px !important;
            }
            div[style*="padding: 32px 28px"] {
              padding: 18px 6vw !important;
            }
          }
        `}
      </style>
    </>
  );
}

// Exporta quitarPlaylist si quieres llamarla desde Perfil.jsx usando contexto o eventos
// export { quitarPlaylist };