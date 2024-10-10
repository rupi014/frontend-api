import React, { useState } from 'react';
import axios from 'axios';
import './users_style.scss';

const Users = () => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userToEdit, setUserToEdit] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    telephone: '',
    address: '',
    role: ''
  });

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Buscar un usuario  
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
        setErrorMessage('');
      } else {
        setUserData(null);
        setErrorMessage(`El usuario ${userId} no existe`);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('No autorizado. Por favor, inicia sesión.');
      } else {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setErrorMessage(`El usuario ${userId} no existe`);
      }
    }
  };

  // Eliminar un usuario
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmDelete) return;

    try {
      const token = getAuthToken();
      await axios.delete(`https://vikingsdb.up.railway.app/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(null);
      setUserToEdit(null);
      setErrorMessage(`Usuario ${id} eliminado exitosamente.`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('No autorizado. Por favor, inicia sesión.');
      } else {
        console.error('Error deleting user', error);
      }
    }
  };

  // Editar un usuario
  const handleEditUser = (user) => {
    if (userToEdit && userToEdit.id === user.id) {
      setUserToEdit(null);
      setNewUser({ username: '', email: '', telephone: '', address: '', role: '' });
    } else {
      setUserToEdit(user);
      setNewUser(user);
    }
  };

  // Actualizar un usuario
  const handleUpdateUser = async () => {
    try {
      const token = getAuthToken();
      const updatedUser = await axios.put(`https://vikingsdb.up.railway.app/users/${userToEdit.id}`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(updatedUser.data);
      setUserToEdit(null);
      setNewUser({ username: '', email: '', telephone: '', address: '', role: '' });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('No autorizado. Por favor, inicia sesión.');
      } else {
        console.error('Error updating user', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  return (
    <div className="users-container">
      <h2>Buscar Usuario</h2>
      <input
        className='search-input'
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
              <th>Acciones</th>
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
              <td>
                <button
                  className={`edit-button ${userToEdit && userToEdit.id === userData.id ? 'hover' : ''}`}
                  onClick={() => handleEditUser(userData)}
                >
                  {userToEdit && userToEdit.id === userData.id ? 'Cancelar' : 'Editar'}
                </button>
                <button className='delete-button' onClick={() => handleDeleteUser(userData.id)}>Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {userToEdit && (
        <div className="edit-section">
          <h2>Editar Usuario</h2>
          <form className="edit-form">
            <label>Nombre de Usuario:</label>
            <input type="text" name="username" value={newUser.username} onChange={handleChange} />
            <label>Email:</label>
            <input type="email" name="email" value={newUser.email} onChange={handleChange} />
            <label>Teléfono:</label>
            <input type="text" name="telephone" value={newUser.telephone} onChange={handleChange} />
            <label>Dirección:</label>
            <input type="text" name="address" value={newUser.address} onChange={handleChange} />
            <label>Rol:</label>
            <input type="text" name="role" value={newUser.role} onChange={handleChange} />
            <button type="button" className='update-button' onClick={handleUpdateUser}>Actualizar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;