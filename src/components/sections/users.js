import React, { useState } from 'react';
import axios from 'axios';
import './users_style.scss';

const Users = () => {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState(''); // Nuevo estado para el email
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
      let query = '';

      if (userId) {
        query = `id=${userId}`;
      } else if (userEmail) {
        query = `email=${userEmail}`;
      }

      const response = await axios.get(`https://vikingsdb.up.railway.app/users?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.length > 0) {
        // Filtrar resultados para asegurar coincidencia exacta del ID o email
        const filteredData = userId 
          ? response.data.filter(user => user.id.toString() === userId) 
          : response.data.filter(user => user.email === userEmail);
        
        if (filteredData.length > 0) {
          setUserData(filteredData);
          setErrorMessage('');
        } else {
          setUserData(null);
          setErrorMessage('No se encontraron usuarios con los criterios de búsqueda proporcionados.');
        }
      } else {
        setUserData(null);
        setErrorMessage('No se encontraron usuarios con los criterios de búsqueda proporcionados.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('No autorizado. Por favor, inicia sesión.');
      } else {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setErrorMessage('No se encontraron usuarios con los criterios de búsqueda proporcionados.');
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
      <input
        className='search-input'
        type="text"
        placeholder="Introduce el email del usuario"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        autoComplete='email'
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
            {userData.map(user => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Nombre de Usuario">{user.username}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Teléfono">{user.telephone}</td>
                <td data-label="Dirección">{user.address}</td>
                <td data-label="Rol">{user.role}</td>
                <td>
                  <button
                    className={`edit-button ${userToEdit && userToEdit.id === user.id ? 'hover' : ''}`}
                    onClick={() => handleEditUser(user)}
                  >
                    {userToEdit && userToEdit.id === user.id ? 'Cancelar' : 'Editar'}
                  </button>
                  <button className='delete-button' onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
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