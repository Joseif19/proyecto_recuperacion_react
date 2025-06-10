import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function UnirsePlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlaylists() {
      setCargando(true);
      setError('');
      try {
        const res = await fetch('http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/playlists');
        if (!res.ok) throw new Error('No se pudieron cargar las playlists');
        const data = await res.json();
        setPlaylists(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    fetchPlaylists();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Unirse a Playlist</h2>
        {cargando && <p>Cargando playlists...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              style={{
                background: '#222',
                border: '1px solid #00ff7f',
                borderRadius: 10,
                padding: 16,
                width: 260,
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              <img
                src={playlist.imagenUrl}
                alt={playlist.nombre}
                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
              />
              <h3 style={{ margin: '10px 0 5px 0', color: '#00ff7f' }}>{playlist.nombre}</h3>
              <p style={{ margin: 0, color: '#ccc' }}>Por: {playlist.nombreUsuario}</p>
              <p style={{ margin: '8px 0 0 0', color: '#aaa', fontSize: 14 }}>
                {playlist.descripcion}
              </p>
            </div>
          ))}
        </div>
        {playlists.length === 0 && !cargando && !error && (
          <p>No hay playlists públicas disponibles.</p>
        )}
      </div>
    </>
  );
}