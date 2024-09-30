import axios from 'axios';

const API_URL = 'https://vikingsdb.up.railway.app';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para actualizar un jugador
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

// Función para actualizar un miembro del staff
export const updateStaff = async (id, updatedStaff) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/staff/${id}`, updatedStaff, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating staff member', error);
    throw error;
  }
};

// Función para actualizar un producto
export const updateProduct = async (id, updatedProduct) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/products/${id}`, updatedProduct, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product', error);
    throw error;
  }
};

// Función para actualizar un pedido
export const updateOrder = async (orderId, updatedOrder) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`https://vikingsdb.up.railway.app/orders/${orderId}`, updatedOrder, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order', error);
    throw error;
  }
};

// Función para actualizar un blog
export const updateBlog = async (id, updatedBlog) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/blog/${id}`, updatedBlog, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog', error);
    throw error;
  }
};
