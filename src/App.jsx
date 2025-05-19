import React, { useState } from 'react';
import LoginFormulario from './componentes/LoginFormulario';
import RegistroFormulario from './componentes/RegistroFormulario';
import BuscadorCanciones from './componentes/BuscadorCanciones';
import './estilos/EstiloLogin.css';

export default function App() {
  const [modo, setModo] = useState('login'); // 'login' o 'registro'

  return (
    <div className={`form-ui ${modo === 'registro' ? 'registro-mode' : ''}`}>
      {modo === 'login' ? (
        <LoginFormulario cambiarModo={() => setModo('registro')} />
      ) : (
        <RegistroFormulario cambiarModo={() => setModo('login')} />
      )}
      <div id="dots">
        <span className={modo === 'login' ? 'active' : ''}></span>
        <span className={modo === 'registro' ? 'active' : ''}></span>
      </div>
      <div>
        <BuscadorCanciones />
      </div>
    </div>

    
  );
}
