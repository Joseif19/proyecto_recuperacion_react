import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function RegistroFormulario({ cambiarModo }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');

    if (pass !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      alert('Cuenta creada con éxito');
      cambiarModo();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="formulario visible">
      <form id="form" onSubmit={handleRegistro}>
        <div id="form-body">
          <div id="welcome-lines">
            <div id="welcome-line-1">PartySync</div>
            <div id="welcome-line-2">Crea una cuenta</div>
          </div>
          <div id="input-area">
            <div className="form-inp">
              <input
                placeholder="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-inp">
              <input
                placeholder="Contraseña"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <div className="form-inp">
              <input
                placeholder="Confirmar contraseña"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>
          <div id="submit-button-cvr">
            <button id="submit-button" type="submit">Registrarse</button>
          </div>
          <div id="forgot-pass">
            <p>¿Ya tienes cuenta? <span onClick={cambiarModo}>Iniciar Sesión</span></p>
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </div>
      </form>
    </div>
  );
}
