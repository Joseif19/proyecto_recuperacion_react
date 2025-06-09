import React, { useState } from 'react';

export default function BuscadorCanciones({ onSeleccionarCancion }) {
  const [query, setQuery] = useState('');
  const [canciones, setCanciones] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function buscar() {
    if (!query.trim()) return;
    setError(null);
    setCargando(true);

    try {
      const response = await fetch(`http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/buscar?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error al buscar canciones');
      }
      const data = await response.json();
      setCanciones(data);
    } catch (e) {
      setError(e.message);
      setCanciones([]);
    } finally {
      setCargando(false);
    }
  }

  function manejarSubmit(e) {
    e.preventDefault();
    buscar();
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, color: 'white', backgroundColor: '#111', borderRadius: 12 }}>
      <h3>Buscador de canciones Spotify</h3>
      <form onSubmit={manejarSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar canciones..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 10, width: '80%', borderRadius: 5, border: '1px solid #00ff7f' }}
        />
        <button type="submit" style={{ padding: '10px 15px', marginLeft: 10, borderRadius: 5, backgroundColor: '#00ff7f', border: 'none', cursor: 'pointer' }}>
          Buscar
        </button>
      </form>

      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {canciones.map((cancion) => (
          <li key={cancion.id} style={{ marginBottom: 15, borderBottom: '1px solid #00ff7f', paddingBottom: 10 }}>
            <strong>{cancion.name}</strong> — {cancion.artists.map(a => a.name).join(', ')}
            <br />
            <audio controls src={cancion.preview_url} style={{ marginTop: 5, width: '100%' }} />
            <button
              onClick={() => onSeleccionarCancion && onSeleccionarCancion({
                spotifyId: cancion.id,
                titulo: cancion.name,
                artista: cancion.artists.map(a => a.name).join(', '),
                album: cancion.album?.name || '',
                imagenUrl: cancion.album?.images?.[0]?.url || '',
              })}
              style={{ marginTop: 8, padding: '5px 10px', borderRadius: 5, backgroundColor: '#00ff7f', border: 'none', cursor: 'pointer' }}
            >
              Añadir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
