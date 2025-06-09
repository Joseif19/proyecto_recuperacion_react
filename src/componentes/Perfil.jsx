// Perfil.jsx
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Perfil() {
  const { user } = useContext(UserContext);
  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil de usuario</h2>
      <p><strong>Nombre de usuario:</strong> {user?.nombreUsuario}</p>
      <p><strong>UID:</strong> {user?.firebaseUID}</p>
      {/* Aquí luego añadirás más detalles y edición */}
    </div>
  );
}
