import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import '../estilos/Navbar.css';

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    setUser(null);
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">PartySync</div>
      <div className="navbar-user">
        {user && (
          <>
            <img
              src={user.fotoUrl}
              alt="Perfil"
              className="navbar-avatar"
              onClick={toggleMenu}
            />
            {menuAbierto && (
              <div className="navbar-menu">
                <button onClick={() => navigate('/perfil')}>Ver perfil</button>
                <button onClick={handleCerrarSesion}>Cerrar sesión</button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
