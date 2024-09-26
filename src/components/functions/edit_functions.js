import axios from 'axios';

const API_URL = 'https://vikingsdb.up.railway.app';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const updatePlayer = async (id, updatedPlayer) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/players/${id}`, updatedPlayer, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating player', error);
    throw error;
  }
};