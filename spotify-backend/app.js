import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3000;

const CLIENT_ID = '91eb5aefa47a49e4b17da648ff3ab4e5';
const CLIENT_SECRET = 'f29681c84ba343879fcde32500da1b05';

let accessToken = '';
let tokenExpiresAt = 0;

// Habilita CORS para el frontend en localhost:5173
app.use(cors({
  origin: 'http://localhost:5173'
}));

async function obtenerToken() {
  if (Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    }
  });

  accessToken = response.data.access_token;
  tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000;

  return accessToken;
}

app.get('/buscar', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send({ error: 'Falta parámetro q' });

  try {
    const token = await obtenerToken();

    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: query,
        type: 'track',
        limit: 10
      }
    });

    res.json(response.data.tracks.items);
  } catch (error) {
    res.status(500).send({ error: 'Error buscando canciones' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});











