import React, { useState, useEffect } from 'react';

export default function BuscadorCanciones({ onSeleccionarCancion }) {
  const [query, setQuery] = useState('');
  const [canciones, setCanciones] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Buscar automáticamente cuando el usuario escribe (mínimo 3 letras)
  useEffect(() => {
    if (query.trim().length >= 3) {
      buscar();
    } else {
      setError(null);
      setCanciones([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function buscar() {
    if (!query.trim()) return;
    setError(null);
    setCargando(true);

    try {
      const response = await fetch(`/api/deezer/buscar?q=${encodeURIComponent(query)}`);
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
    // Ya no es necesario llamar a buscar aquí, porque el efecto lo hace automáticamente
  }

  function añadirCancion(cancion) {

    onSeleccionarCancion && onSeleccionarCancion(cancion);
    setQuery('');
    setCanciones([]);
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, color: 'white', backgroundColor: '#111', borderRadius: 12, position: 'relative' }}>
      <h3>¡Añade canciones a tu playlist!</h3>
      <form onSubmit={manejarSubmit} style={{ marginBottom: 20, position: 'relative' }}>
        <input
          type="text"
          placeholder="Buscar canciones..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 10, width: '80%', borderRadius: 5, border: '1px solid #00ff7f' }}
          autoComplete="off"
        />
        {/* Botón de buscar eliminado */}
        {/* Autocomplete dropdown */}
        {Array.isArray(canciones) && canciones.length > 0 && query && (
          <ul style={{
            position: 'absolute',
            top: 55,
            left: 0,
            right: 0,
            background: '#222',
            border: '1px solid #00ff7f',
            borderRadius: 5,
            maxHeight: 250,
            overflowY: 'auto',
            zIndex: 10,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            width: '80%'
          }}>
            {canciones.map((cancion) => (
              <li
                key={cancion.cancionId}
                style={{
                  padding: 10,
                  borderBottom: '1px solid #00ff7f',
                  cursor: 'pointer'
                }}
                onClick={() => añadirCancion({
                  cancionId: cancion.cancionId,
                  nombre: cancion.nombre,
                  artista: cancion.artista,
                  duracion: cancion.duracion,
                })}
              >
                <strong>{cancion.nombre}</strong> — {cancion.artista} ({cancion.duracion}s)
              </li>
            ))}
          </ul>
        )}
      </form>
      {/* Lista de canciones añadidas */}
      
      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {Array.isArray(canciones) && canciones.length === 0 && !cargando && !error && query.length >= 3 && (
        <p>No se encontraron canciones.</p>
      )}
    </div>
  );
}