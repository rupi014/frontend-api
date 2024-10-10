import axios from 'axios';

const API_URL = 'https://vikingsdb.up.railway.app';

// Servicios de autenticacion

// Funcion para iniciar sesion
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/token`, { username, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

// Funcion para registrar un nuevo usuario
export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, password });
  return response.data;
};

// Funcion para obtener el token del usuario
export const getCurrentUser = () => {
  return localStorage.getItem('token');
};

// Funcion para cerrar sesion
export const logout = () => {
  localStorage.removeItem('token');
};