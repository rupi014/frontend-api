import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://vikingsdb.up.railway.app/register', {
        username,
        email,
        password,
        telephone,
        address,
        role,

      });
      console.log('Registro exitoso', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error al registrar', error.response.data);
      } else {
        console.error('Error al registrar', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Usuario:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div>
        <label>Rol:</label>
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegisterForm;