import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.scss';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await axios.post('https://vikingsdb.up.railway.app/token', params);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userName', username);
      console.log('Inicio de sesión exitoso', response.data);
      navigate('/status', { state: { isLoggedIn: true } });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Usuario/contraseña incorrecto'); // Error de autenticación
        } else {
          setErrorMessage('No fue posible conectar al servidor'); // Otro error del servidor
        }
      } else {
        setErrorMessage('No fue posible conectar al servidor'); // Error de red u otro problema
      }
      console.error('Error al iniciar sesión', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Inicio de Sesión</h1>
        <div>
          <label>Usuario:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            autoComplete="username" // Agrega el atributo autocomplete
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="current-password" // Agrega el atributo autocomplete
          />
        </div> 
        <button type="submit">Iniciar Sesión</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
