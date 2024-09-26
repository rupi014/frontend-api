import axios from 'axios';

const API_URL = 'https://vikingsdb.up.railway.app';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para añadir un producto
export const addProduct = async (product) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/products/`, product, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product', error);
    throw error;
  }
};

// Función para añadir un pedido
export const addOrder = async (order) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/orders/`, order, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding order', error);
    throw error;
  }
};

// Función para añadir un jugador
export const addPlayer = async (player) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/players/`, player, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding player', error);
    throw error;
  }
};

// Función para añadir un miembro del staff
export const addStaff = async (staff) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/staff/`, staff, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding staff member', error);
    throw error;
  }
};

// Función para añadir un blog
export const addBlog = async (blog) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/blog/`, blog, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding blog', error);
    throw error;
  }
};