import axios from 'axios';

const API_URL = 'https://vikingsdb.up.railway.app';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product', error);
    throw error;
  }
};

// Función para eliminar un pedido
export const deleteOrder = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order', error);
    throw error;
  }
};

// Función para eliminar un jugador
export const deletePlayer = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/players/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting player', error);
    throw error;
  }
};

// Función para eliminar un miembro del staff
export const deleteStaff = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/staff/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting staff member', error);
    throw error;
  }
};

// Función para eliminar un blog
export const deleteBlog = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting blog', error);
    throw error;
  }
};