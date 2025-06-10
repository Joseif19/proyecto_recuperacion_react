import React, { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAbierto]);

  const handleCerrarSesion = () => {
    // Aquí tu lógica de logout
    setUser(null);
    navigate('/');
  };

  const handleVerPerfil = () => {
    setMenuAbierto(false);
    navigate('/perfil');
  };

  return (
    <nav
      style={{
        width: '100%',
        height: 64,
        background: 'rgba(34,34,34,0.98)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px #0006',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        padding: '0 36px'
      }}
    >
      {/* Logo PartySync */}
      <div
        style={{
          fontWeight: 'bold',
          fontSize: 26,
          color: '#1db954',
          letterSpacing: 1,
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => navigate('/principal')}
      >
        PartySync
      </div>

      {/* Imagen de perfil y menú */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <img
          src='/imagenes/avatar_pred.jpg'
          alt="Perfil"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2.5px solid #1db954',
            cursor: 'pointer',
            marginRight: 0
          }}
          onClick={() => setMenuAbierto((v) => !v)}
        />
        {menuAbierto && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: 54,
              right: 0,
              background: '#232323',
              borderRadius: 12,
              boxShadow: '0 4px 16px #000a',
              minWidth: 160,
              padding: '10px 0',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}
          >
            <button
              onClick={handleVerPerfil}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'background 0.2s',
                outline: 'none'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#1db95422'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              Ver perfil
            </button>
            <button
              onClick={handleCerrarSesion}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'background 0.2s',
                outline: 'none'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#ff3b3b22'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}