import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.scss';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Iniciar sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const tokenResponse = await axios.post('https://vikingsdb.up.railway.app/token', params);
      const accessToken = tokenResponse.data.access_token;

      // Realiza una solicitud para obtener la información del usuario
      const userResponse = await axios.get('https://vikingsdb.up.railway.app/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const { role } = userResponse.data;

      // Verificar si el usuario tiene permisos de administrador
      if (role !== 'admin') {
        setErrorMessage('Acceso denegado: solo los administradores pueden iniciar sesión');
        return;
      }

      localStorage.setItem('token', accessToken);
      localStorage.setItem('userName', username);
      console.log('Inicio de sesión exitoso');
      navigate('/status', { state: { isLoggedIn: true } });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Usuario // Contraseña incorrecto');
        } else {
          setErrorMessage('No fue posible conectar al servidor');
        }
      } else {
        setErrorMessage('No fue posible conectar al servidor');
      }
      console.error('Error al iniciar sesión', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Inicio de Sesión</h2>
        <div>
          <label>Usuario:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            autoComplete="name"
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="current-password"
          />
        </div> 
        <button type="submit">Iniciar Sesión</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
