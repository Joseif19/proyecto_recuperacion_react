import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import Navbar from './Navbar';
import BotonVolver from './BotonVolver';

export default function Perfil() {
  const { user } = useContext(UserContext);
  const [playlistsCreadas, setPlaylistsCreadas] = useState([]);
  const [playlistsUnidas, setPlaylistsUnidas] = useState([]);

  // Cargar playlists creadas por el usuario
  useEffect(() => {
    if (!user?.firebaseUid) return;
    fetch('http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/playlists')
      .then(res => res.json())
      .then(data => {
        // Filtra playlists donde el creador sea el usuario actual
        const creadas = data.filter(p => p.creadorId === user.firebaseUid);
        setPlaylistsCreadas(creadas);
      })
      .catch(() => setPlaylistsCreadas([]));
  }, [user]);

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #181818 0%, #232323 100%)',
          paddingTop: 120,
          paddingBottom: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <div style={{
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <h2 style={{
            color: '#1db954',
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center'
          }}>
            Mi Perfil
          </h2>
          <p style={{
            color: '#fff',
            fontSize: 18,
            marginBottom: 32,
            textAlign: 'center',
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            En este apartado podrás ver tus datos y gestionar tu cuenta.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(34,34,34,0.97)',
            borderRadius: 20,
            padding: 32,
            boxShadow: '0 4px 32px #000a',
            marginBottom: 40
          }}>
            {/* Datos personales */}
            <div style={{ flex: 1, textAlign: 'right', paddingRight: 40 }}>
              <p style={{ color: '#b3b3b3', fontSize: 18, marginBottom: 10 }}>
                <strong>Nombre de usuario:</strong> {user?.username || user?.nombreUsuario || 'No disponible'}
              </p>
              <p style={{ color: '#b3b3b3', fontSize: 18 }}>
                <strong>ID usuario:</strong> {user?.firebaseUid || user?.uid || 'No disponible'}
              </p>
            </div>
            {/* Imagen de perfil fija */}
            <div style={{ flex: 0, textAlign: 'center', position: 'relative' }}>
              <img
                src="/imagenes/avatar_pred.jpg"
                alt="Perfil"
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '6px solid #1db954',
                  boxShadow: '0 4px 32px #000a',
                  margin: '0 40px'
                }}
              />
            </div>
            {/* Estadísticas */}
            <div style={{ flex: 1, textAlign: 'left', paddingLeft: 40 }}>
              <p style={{ color: '#1db954', fontSize: 22, marginBottom: 10 }}>
                <strong>Playlists creadas:</strong> {playlistsCreadas.length}
              </p>
              <p style={{ color: '#1db954', fontSize: 22, marginBottom: 10 }}>
                <strong>Playlists unidas:</strong> {playlistsUnidas.length}
              </p>
            </div>
          </div>
          {/* Playlists unidas */}
          <div style={{
            background: 'rgba(34,34,34,0.97)',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 2px 16px #0007'
          }}>
            <h3 style={{ color: '#fff', marginBottom: 18 }}>Playlists en las que te has unido</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {Array.isArray(playlistsUnidas) && playlistsUnidas.length === 0 && (
                <p style={{ color: '#aaa' }}>No te has unido a ninguna playlist.</p>
              )}
              {Array.isArray(playlistsUnidas) && playlistsUnidas.map((playlist) => (
                <div
                  key={playlist.id}
                  style={{
                    background: '#222',
                    border: '1px solid #1db954',
                    borderRadius: 10,
                    padding: 16,
                    width: 260,
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={playlist.imagenUrl}
                    alt={playlist.nombre}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                  />
                  <h4 style={{ margin: '10px 0 5px 0', color: '#1db954' }}>{playlist.nombre}</h4>
                  <p style={{ margin: 0, color: '#ccc' }}>Por: {playlist.nombreUsuario}</p>
                  <p style={{ margin: '8px 0 0 0', color: '#aaa', fontSize: 14 }}>
                    {playlist.descripcion}
                  </p>
                </div>
              ))}
            </div>
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
          }
          @media (max-width: 600px) {
            div[style*="max-width: 1100px"] {
              padding: 18px 4vw !important;
              max-width: 98vw !important;
            }
            h2 {
              font-size: 22px !important;
            }
            p {
              font-size: 15px !important;
            }
          }
        `}
      </style>
    </>
  );
}