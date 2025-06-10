import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../estilos/EstiloLoginRegistro.css';

export default function RegistroFormulario() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');

    if (pass !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUid = userCredential.user.uid;

      await axios.post('http://partysync-react.us-east-1.elasticbeanstalk.com:82/api/v1/usuarios', {
        firebaseUid,
        username,
        fotoUrl: 'https://i.imgur.com/WP7mFmg.png',
        playlistsCreadas: 0,
        playlistsUnidas: 0
      });

      navigate('/login'); // Redirige a login para iniciar sesión
    } catch (err) {
      setError('Error al registrar usuario: ' + err.message);
    }
  };

  return (
    <div className="login-registro">
      <div className="form-ui">
        <form id="form" onSubmit={handleRegistro}>
          <div id="form-body">
            <div id="welcome-lines">
              <div id="welcome-line-1">PartySync</div>
              <div id="welcome-line-2">Crea una cuenta</div>
            </div>
            <div id="input-area">
              <div className="form-inp">
                <input
                  placeholder="Nombre de usuario"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
              <p>
                ¿Ya tienes cuenta?{' '}
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </span>
              </p>
            </div>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
