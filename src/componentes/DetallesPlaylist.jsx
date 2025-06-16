import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { UserContext } from '../contexts/UserContext';
import BotonVolver from './BotonVolver';

export default function DetallesPlaylist() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [playlist, setPlaylist] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [canciones, setCanciones] = useState([]);
    const [orden, setOrden] = useState('desc');
    const [likes, setLikes] = useState({});
    const [unido, setUnido] = useState(false);

    useEffect(() => {
    async function fetchPlaylist() {
        setCargando(true);
        setError('');
        try {
            const res = await fetch(`http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/playlists/${id}`);
            if (!res.ok) throw new Error('No se pudo cargar la playlist');
            const data = await res.json();
            console.log('Playlist recibida:', data); // <-- Aquí
            setPlaylist(data);
            setCanciones(data.canciones || []);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    }
    fetchPlaylist();
}, [id]);

    useEffect(() => {
        async function fetchLikes() {
            if (!canciones.length || !playlist) return;
            try {
                const ids = canciones.map(c => c.cancionId).join(',');
                const res = await fetch(`http://partysync-react.us-east-1.elasticbeanstalk.com:81/api/v1/canciones/likes?salaId=${playlist.id}&canciones=${ids}`);
                if (!res.ok) throw new Error('No se pudieron cargar los likes');
                const data = await res.json();
                setLikes(data);
            } catch (e) { }
        }
        fetchLikes();
    }, [canciones, playlist]);

    useEffect(() => {
        if (playlist && user) {
            setUnido((playlist.usuariosUnidos || []).includes(user.firebaseUid));
        }
    }, [playlist, user]);

    const cancionesOrdenadas = [...canciones].sort((a, b) => {
        const likesA = likes[a.cancionId] || 0;
        const likesB = likes[b.cancionId] || 0;
        return orden === 'desc' ? likesB - likesA : likesA - likesB;
    });

    const handleUnirse = async () => {
    if (!user || !user.firebaseUid) {
        alert('Debes iniciar sesión para unirte a la playlist.');
        return;
    }
    try {
        const res = await fetch(`http://partysync-react.us-east-1.elasticbeanstalk.com/api/v1/playlists/${id}/unirse?usuarioId=${user.firebaseUid}`, {
            method: 'POST'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'No se pudo unir a la playlist');
        setUnido(true);
        // Actualiza la playlist localmente para incluir el usuario unido
        setPlaylist(prev => ({
            ...prev,
            usuariosUnidos: [...(prev.usuariosUnidos || []), user.firebaseUid]
        }));
        alert('¡Te has unido a la playlist!');
    } catch (e) {
        alert(e.message);
    }
};

    const handleLike = async (cancionId) => {
        if (!user || !user.firebaseUid) {
            alert('Debes iniciar sesión para votar.');
            return;
        }
        try {
            const res = await fetch(`http://partysync-react.us-east-1.elasticbeanstalk.com:81/api/v1/canciones/${cancionId}/votar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuarioId: user.firebaseUid,
                    salaId: playlist.id,
                    voto: 1
                })
            });
            if (!res.ok) throw new Error('No se pudo votar');
            const ids = canciones.map(c => c.cancionId).join(',');
            const likesRes = await fetch(`http://partysync-react.us-east-1.elasticbeanstalk.com:81/api/v1/canciones/likes?salaId=${playlist.id}&canciones=${ids}`);
            if (likesRes.ok) {
                const data = await likesRes.json();
                setLikes(data);
            }
        } catch (e) {
            alert(e.message);
        }
    };

    // Logs para depuración
    console.log('user:', user);
    console.log('user.firebaseUid:', user && user.firebaseUid);
    console.log('unido:', unido);

    return (
        <>
            <Navbar />
            <div style={{
                background: 'linear-gradient(135deg, #181818 0%, #232323 100%)',
                minHeight: '100vh',
                paddingTop: 120,
                paddingBottom: 40,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: 1300,
                    margin: '0 auto 48px auto',
                    background: 'rgba(34,34,34,0.95)',
                    borderRadius: 20,
                    padding: 40,
                    boxShadow: '0 4px 32px #000a'
                }}>
                    {/* Imagen de perfil predeterminada */}
                    <img
                        src={playlist?.imagenUrl || "https://i.imgur.com/WP7mFmg.png"}
                        alt="Imagen Playlist"
                        style={{
                            width: 220,
                            height: 220,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 4px 32px #000a',
                            marginRight: 48,
                            border: '6px solid #1db954'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h1 style={{ color: '#1db954', fontSize: 40, marginBottom: 12 }}>{playlist?.nombre}</h1>
                        <p style={{ color: '#b3b3b3', fontSize: 20, marginBottom: 10 }}>{playlist?.descripcion}</p>
                        <p style={{ color: '#1db954', fontWeight: 600, marginBottom: 10 }}>
                            Creada por: {playlist?.nombreUsuario}
                        </p>
                        <p style={{ color: '#b3b3b3', fontSize: 16 }}>
                            Canciones: {playlist?.canciones?.length || 0}
                        </p>
                    </div>
                    <div style={{ marginLeft: 48, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <button
                            onClick={handleUnirse}
                            disabled={unido || !user || !user.firebaseUid}
                            style={{
                                background: unido ? '#444' : '#1db954',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 30,
                                padding: '16px 44px',
                                fontSize: 20,
                                fontWeight: 700,
                                cursor: unido ? 'not-allowed' : 'pointer',
                                marginBottom: 10,
                                transition: 'background 0.2s'
                            }}
                        >
                            {unido ? 'Ya eres miembro' : 'Unirme'}
                        </button>
                        {/* Feedback visual */}
                        {!user || !user.firebaseUid ? (
                            <p style={{ color: '#ff3b3b', marginTop: 8 }}>Debes iniciar sesión para unirte a la playlist.</p>
                        ) : unido ? (
                            <p style={{ color: '#1db954', marginTop: 8 }}>Ya eres miembro de esta playlist.</p>
                        ) : null}
                    </div>
                </div>

                <div style={{
                    maxWidth: 1300,
                    margin: '0 auto',
                    background: 'rgba(34,34,34,0.97)',
                    borderRadius: 16,
                    padding: 36,
                    boxShadow: '0 2px 16px #0007'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h2 style={{ color: '#fff', fontSize: 28, margin: 0 }}>Canciones de la playlist</h2>
                        <div>
                            <button
                                onClick={() => setOrden(orden === 'desc' ? 'asc' : 'desc')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1db954',
                                    fontWeight: 700,
                                    fontSize: 18,
                                    cursor: 'pointer'
                                }}
                            >
                                Ordenar por likes {orden === 'desc' ? '↓' : '↑'}
                            </button>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ color: '#1db954', fontSize: 17, borderBottom: '2px solid #333' }}>
                                <th style={{ textAlign: 'left', padding: '12px 8px' }}>#</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Canción</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Artista</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Duración</th>
                                <th style={{ textAlign: 'center', padding: '12px 8px' }}>Likes</th>
                                <th style={{ textAlign: 'center', padding: '12px 8px' }}>Votar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cancionesOrdenadas.map((c, idx) => (
                                <tr key={c.cancionId} style={{ color: '#fff', borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '12px 8px' }}>{idx + 1}</td>
                                    <td style={{ padding: '12px 8px' }}>{c.nombre}</td>
                                    <td style={{ padding: '12px 8px' }}>{c.artista}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        {Math.floor(c.duracion / 60)}:{(c.duracion % 60).toString().padStart(2, '0')}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700, color: '#1db954' }}>
                                        {likes[c.cancionId] || 0}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                                        <button
                                            onClick={() => handleLike(c.cancionId)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#1db954',
                                                fontSize: 22,
                                                cursor: 'pointer'
                                            }}
                                            title="Me gusta"
                                        >
                                            <span role="img" aria-label="like">👍</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cancionesOrdenadas.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ color: '#aaa', textAlign: 'center', padding: 30 }}>
                                        No hay canciones en esta playlist.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {cargando && (
                    <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
                        Cargando...
                    </div>
                )}
                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>
                        {error}
                    </div>
                )}
                {/* Botón volver abajo y centrado */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                    <BotonVolver texto="Volver" />
                </div>
            </div>
        </>
    );
}