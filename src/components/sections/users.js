import React, { useState } from 'react';
import axios from 'axios';
import './users_style.css';

const Users = () => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleSearch = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`https://vikingsdb.up.railway.app/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        setUserData(response.data);
        setErrorMessage(''); // Limpiar el mensaje de error si se encuentra el usuario
      } else {
        setUserData(null);
        setErrorMessage(`El usuario ${userId} no existe`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
      setErrorMessage(`El usuario ${userId} no existe`);
    }
  };

  return (
    <div className="users-container">
      <h2>Buscar Usuario</h2>
      <input
        type="text"
        placeholder="Introduce el ID del usuario"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {userData && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="ID">{userData.id}</td>
              <td data-label="Nombre de Usuario">{userData.username}</td>
              <td data-label="Email">{userData.email}</td>
              <td data-label="Teléfono">{userData.telephone}</td>
              <td data-label="Dirección">{userData.address}</td>
              <td data-label="Rol">{userData.role}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;