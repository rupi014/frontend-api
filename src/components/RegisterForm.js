import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './RegisterForm.scss'; // Importa la hoja de estilos SCSS

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate(); // Usa useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://vikingsdb.up.railway.app/register', {
        username,
        email,
        password,
        telephone,
        address,
      });
      console.log('Registro exitoso', response.data);
      navigate('/login'); // Redirige a la página de login
    } catch (error) {
      if (error.response) {
        console.error('Error al registrar', error.response.data);
      } else {
        console.error('Error al registrar', error);
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form"> 
        <h2>Registro</h2> 
        <div>
          <label>Usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} autocomplete="username" />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autocomplete="new-password" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autocomplete="email" />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} autocomplete="tel" />
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} autocomplete="street-address" />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterForm;