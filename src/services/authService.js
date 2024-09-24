import axios from 'axios';

const API_URL = 'https://vikingsdb.up.railway.app';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/token`, { username, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, password });
  return response.data;
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};