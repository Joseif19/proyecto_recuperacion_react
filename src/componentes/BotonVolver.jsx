import { useNavigate } from 'react-router-dom';

function BotonVolver({ texto = "Volver atrás" }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        margin: '18px 0 0 0',
        background: '#232323',
        color: '#1db954',
        border: '2px solid #1db954',
        borderRadius: 8,
        padding: '10px 24px',
        fontSize: 16,
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      {texto}
    </button>
  );
}

export default BotonVolver;