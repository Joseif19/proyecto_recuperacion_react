import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Principal() {
  const navigate = useNavigate();

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
          justifyContent: 'center',
          paddingTop: 100
        }}
      >
        <h1 style={{
          color: '#1db954',
          fontSize: 48,
          fontWeight: 'bold',
          marginBottom: 16,
          letterSpacing: 1
        }}>
          ¡Bienvenido a PartySync!
        </h1>
        <p style={{
          color: '#fff',
          fontSize: 22,
          marginBottom: 48,
          maxWidth: 600,
          textAlign: 'center'
        }}>
          Disfruta creando tu propia playlist o únete a una ya existente para compartir la mejor música con tus amigos. ¡Haz que cada momento sea único con PartySync!
        </p>
        <div style={{
          display: 'flex',
          gap: 40,
          marginBottom: 32
        }}>
          <button
            onClick={() => navigate('/crear-playlist')}
            style={{
              background: '#1db954',
              color: '#fff',
              fontSize: 28,
              fontWeight: 'bold',
              padding: '28px 48px',
              border: 'none',
              borderRadius: 18,
              boxShadow: '0 4px 24px #1db95444',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.2s',
              letterSpacing: 1,
              outline: 'none'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#17a74a'}
            onMouseOut={e => e.currentTarget.style.background = '#1db954'}
          >
            Crear Playlist
          </button>
          <button
            onClick={() => navigate('/unirse-playlist')}
            style={{
              background: '#232323',
              color: '#1db954',
              fontSize: 28,
              fontWeight: 'bold',
              padding: '28px 48px',
              border: '2.5px solid #1db954',
              borderRadius: 18,
              boxShadow: '0 4px 24px #000a',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s, transform 0.2s',
              letterSpacing: 1,
              outline: 'none'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#1db95422';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#232323';
              e.currentTarget.style.color = '#1db954';
            }}
          >
            Unirte a Playlist
          </button>
        </div>
      </div>
    </>
  );
}