import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import '../estilos/EstiloLoginRegistro.css';

export default function LoginFormulario() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUid = userCredential.user.uid;

      // Petición a microservicio para obtener datos extras
      const response = await axios.get(`http://partysync-react.us-east-1.elasticbeanstalk.com:82/api/v1/usuarios/${firebaseUid}`);

      setUser(response.data);

      alert('Inicio de sesión exitoso');
      navigate('/principal'); // Redirige a página principal
    } catch (err) {
      setError('Credenciales inválidas o error en la conexión');
    }
  };

  return (
    <div className="login-registro">
      <div className="form-ui">
        <form id="form" onSubmit={handleLogin}>
          <div id="form-body">
            <div id="welcome-lines">
              <div id="welcome-line-1">PartySync</div>
              <div id="welcome-line-2">Bienvenido de nuevo</div>
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
            </div>
            <div id="submit-button-cvr">
              <button id="submit-button" type="submit">Iniciar Sesión</button>
            </div>
            <div id="forgot-pass">
              <p>
                ¿No tienes cuenta?{' '}
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => navigate('/registro')}
                >
                  Registrarse
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
