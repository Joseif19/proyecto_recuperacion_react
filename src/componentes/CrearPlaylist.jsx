import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import '../estilos/CrearPlaylist.css';
import { UserContext } from '../contexts/UserContext';
import BuscadorCanciones from './BuscadorCanciones';

const defaultImages = [
  'https://i.imgur.com/1.png',
  'https://i.imgur.com/2.png',
  'https://i.imgur.com/3.png',
  'https://i.imgur.com/4.png',
  'https://i.imgur.com/5.png',
  'https://i.imgur.com/6.png',
];

export default function CrearPlaylist() {
  const { user } = useContext(UserContext);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [privacidad, setPrivacidad] = useState('publica');
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
        publica: privacidad === 'publica',
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
      setPrivacidad('publica');
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
      <div className="crear-playlist-container">
        <form className="formulario-playlist" onSubmit={handleSubmit}>
          <h2>Crear Playlist</h2>

          <label>Nombre de Playlist *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Descripción (opcional)</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          />

          <label>Privacidad</label>
          <select
            value={privacidad}
            onChange={(e) => setPrivacidad(e.target.value)}
          >
            <option value="publica">Pública</option>
            <option value="privada">Privada</option>
          </select>

          <button className="btn-crear" type="submit">
            Crear Playlist
          </button>

          {error && <p className="error-msg">{error}</p>}
          {exito && <p className="exito-msg">{exito}</p>}
        </form>

        <div className="seleccion-portada">
          <h3>Elige portada</h3>
          <div className="imagenes-portada">
            {defaultImages.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Portada ${i + 1}`}
                className={portada === img ? 'seleccionada' : ''}
                onClick={() => {
                  setPortada(img);
                  setImagenPersonalizada(null);
                }}
              />
            ))}

            <div className="fila-inferior">
              {defaultImages.slice(4, 6).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Portada ${i + 5}`}
                  className={portada === img ? 'seleccionada' : ''}
                  onClick={() => {
                    setPortada(img);
                    setImagenPersonalizada(null);
                  }}
                />
              ))}
              <label className="input-file-label" title="Subir imagen personalizada">
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
        </div>

        {/* Buscador y selección de canciones */}
        <div style={{ marginTop: 40, color: 'white' }}>
          <BuscadorCanciones
            onSeleccionarCancion={(cancion) => {
              if (!cancionesSeleccionadas.find(c => c.spotifyId === cancion.spotifyId)) {
                setCancionesSeleccionadas([...cancionesSeleccionadas, cancion]);
              }
            }}
          />

          <h4>Canciones añadidas:</h4>
          <ul>
            {cancionesSeleccionadas.map((c, i) => (
              <li key={i} style={{ marginBottom: 5 }}>
                {c.titulo} — {c.artista}
                <button
                  onClick={() => setCancionesSeleccionadas(cancionesSeleccionadas.filter((_, idx) => idx !== i))}
                  style={{ marginLeft: 10, cursor: 'pointer' }}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
