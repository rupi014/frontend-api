import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a la API de Vikings</h1>
      <p>Elige una opción:</p>
      <Link to="/login">Iniciar Sesión</Link>
      <br />
      <Link to="/register">Registrarse</Link>
    </div>
  );
};

export default Home;