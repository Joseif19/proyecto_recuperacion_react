import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import BuscadorCanciones from './BuscadorCanciones';
import BotonVolver from './BotonVolver';

const defaultImages = [
  '/imagenes/perfil1.png',
  '/imagenes/perfil2.png',
  '/imagenes/perfil3.png',
  '/imagenes/perfil4.png',
  '/imagenes/perfil5.png',
  '/imagenes/perfil6.png',
  '/imagenes/perfil7.png',
];

export default function CrearPlaylist() {
  const { user } = useContext(UserContext);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [portada, setPortada] = useState(defaultImages[0]);
  const [imagenPersonalizada, setImagenPersonalizada] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cancionesSeleccionadas, setCancionesSeleccionadas] = useState([]);

  const handleImagenPersonalizada = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPortada(reader.result);
      setImagenPersonalizada(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!nombre.trim()) {
      setError('El nombre de la playlist es obligatorio');
      return;
    }

    if (!user) {
      setError('No se ha detectado usuario autenticado');
      return;
    }

    try {
      // Crear playlist
      const { data: playlistCreada } = await axios.post('http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/playlists', {
        nombre,
        descripcion,
        publica: true,
        imagenUrl: portada,
        nombreUsuario: user.username || user.nombreUsuario || '',
        usuarioId: user.firebaseUid || user.uid || '',
      });

      // Añadir canciones
      for (const cancion of cancionesSeleccionadas) {
        await axios.post(`http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/playlists/${playlistCreada.id}/canciones`, cancion);
      }

      setExito(`Playlist creada con éxito con ${cancionesSeleccionadas.length} canción(es)`);
      setNombre('');
      setDescripcion('');
      setPortada(defaultImages[0]);
      setImagenPersonalizada(null);
      setCancionesSeleccionadas([]);

    } catch (err) {
      setError('Error al crear la playlist: ' + (err.response?.data || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #181818 0%, #232323 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 110,
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 60,
            width: '100%',
            maxWidth: 1400,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          {/* Columna izquierda: portada y selección */}
          <div
            style={{
              flex: '0 0 340px',
              background: 'rgba(34,34,34,0.98)',
              borderRadius: 18,
              boxShadow: '0 4px 24px #000a',
              padding: '36px 28px',
              margin: '0 0 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 260,
              maxWidth: 340,
            }}
          >
            <h3 style={{ color: '#1db954', fontWeight: 'bold', fontSize: 22, marginBottom: 18, textAlign: 'center' }}>
              Elige portada
            </h3>
            <img
              src={portada}
              alt="Portada seleccionada"
              style={{
                width: 140,
                height: 140,
                borderRadius: 18,
                objectFit: 'cover',
                border: '3px solid #1db954',
                marginBottom: 22,
                boxShadow: '0 2px 16px #1db95433'
              }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
              {defaultImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Portada ${i + 1}`}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: portada === img ? '2.5px solid #1db954' : '2px solid #444',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    boxShadow: portada === img ? '0 2px 8px #1db95466' : '0 2px 6px #000a',
                    transition: 'border 0.2s, box-shadow 0.2s'
                  }}
                  onClick={() => {
                    setPortada(img);
                    setImagenPersonalizada(null);
                  }}
                />
              ))}
              {/* Botón para imagen personalizada */}
              <label
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: imagenPersonalizada ? '2.5px solid #1db954' : '2px solid #444',
                  background: '#232323',
                  color: '#1db954',
                  fontSize: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: imagenPersonalizada ? '0 2px 8px #1db95466' : '0 2px 6px #000a',
                  transition: 'border 0.2s, box-shadow 0.2s'
                }}
                title="Subir imagen personalizada"
              >
                +
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenPersonalizada}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Columna derecha: formulario y canciones */}
          <div
            style={{
              flex: 1,
              background: 'rgba(34,34,34,0.98)',
              borderRadius: 18,
              boxShadow: '0 4px 24px #000a',
              padding: '48px 56px',
              minWidth: 400,
              maxWidth: 900,
              margin: '0 0 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}
          >
            <h2
              style={{
                color: '#1db954',
                fontSize: 34,
                fontWeight: 'bold',
                marginBottom: 12,
                textAlign: 'left',
                letterSpacing: 1
              }}
            >
              Crear Playlist
            </h2>
            <p style={{
              color: '#b3b3b3',
              fontSize: 18,
              marginBottom: 28,
              textAlign: 'left',
              maxWidth: 500
            }}>
              Crea tu playlist personalizada, elige una portada y añade tus canciones favoritas.
            </p>
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: 30,
                alignItems: 'flex-start'
              }}
            >
              <div style={{ flex: 1 }}>
                <label style={{ color: '#fff', fontSize: 18, marginBottom: 8, display: 'block' }}>
                  Nombre de la playlist *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1.5px solid #1db954',
                    fontSize: 18,
                    background: '#232323',
                    color: '#fff',
                    outline: 'none',
                    marginBottom: 18
                  }}
                />
                <label style={{ color: '#fff', fontSize: 18, marginBottom: 8, display: 'block' }}>
                  Descripción (opcional)
                </label>
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1.5px solid #1db954',
                    fontSize: 16,
                    background: '#232323',
                    color: '#fff',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#1db954',
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 'bold',
                    padding: '16px 0',
                    border: 'none',
                    borderRadius: 10,
                    boxShadow: '0 2px 12px #1db95444',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    marginTop: 18,
                    width: '100%'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#17a74a'}
                  onMouseOut={e => e.currentTarget.style.background = '#1db954'}
                >
                  Crear Playlist
                </button>
                {error && <p style={{ color: '#ff3b3b', margin: 0, textAlign: 'center' }}>{error}</p>}
                {exito && <p style={{ color: '#1db954', margin: 0, textAlign: 'center' }}>{exito}</p>}
              </div>
              <div style={{ flex: 1, marginLeft: 20 }}>
                <BuscadorCanciones
                  onSeleccionarCancion={(cancion) => {
                    if (!cancionesSeleccionadas.find(c => c.cancionId === cancion.cancionId)) {
                      setCancionesSeleccionadas([...cancionesSeleccionadas, cancion]);
                    }
                  }}
                />
                <h4 style={{ marginTop: 24, marginBottom: 10, color: '#1db954' }}>Canciones añadidas:</h4>
                <ul style={{ width: '100%', paddingLeft: 0 }}>
                  {cancionesSeleccionadas.map((c, i) => (
                    <li key={i} style={{
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#232323',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontSize: 16,
                      color: '#fff'
                    }}>
                      <span style={{ color: '#fff' }}>{c.nombre} — {c.artista}</span>
                      <button
                        onClick={() => setCancionesSeleccionadas(cancionesSeleccionadas.filter((_, idx) => idx !== i))}
                        style={{
                          marginLeft: 10,
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          color: '#ff3b3b',
                          fontWeight: 'bold',
                          fontSize: 16
                        }}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          </div>
        </div>
        {/* Botón volver abajo y centrado */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <BotonVolver texto="Volver" />
        </div>
      </div>
      {/* Responsive: cambia a columnas apiladas en móvil */}
      <style>
        {`
          @media (max-width: 1400px) {
            div[style*="max-width: 1400px"] {
              max-width: 98vw !important;
            }
          }
          @media (max-width: 1100px) {
            div[style*="max-width: 1400px"] {
              flex-direction: column !important;
              gap: 24px !important;
              align-items: center !important;
            }
            div[style*="flex: 0 0 340px"] {
              margin-bottom: 18px !important;
            }
            form[style*="flex-direction: row"] {
              flex-direction: column !important;
              gap: 10px !important;
            }
            div[style*="marginLeft: 20px"] {
              margin-left: 0 !important;
            }
          }
          @media (max-width: 900px) {
            div[style*="padding: 48px 56px"] {
              padding: 24px 8vw !important;
              min-width: 0 !important;
              max-width: 98vw !important;
            }
          }
          @media (max-width: 700px) {
            div[style*="max-width: 1400px"] {
              padding: 0 2vw !important;
            }
            div[style*="max-width: 600px"] {
              padding: 18px 4vw !important;
              max-width: 98vw !important;
            }
            h2 {
              font-size: 22px !important;
            }
            h3 {
              font-size: 16px !important;
            }
          }
        `}
      </style>
    </>
  );
}