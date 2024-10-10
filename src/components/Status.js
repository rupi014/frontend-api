import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './status.scss';

// Pagina de inicio
const Status = () => {
  const [userName, setUserName] = useState('');

  // Obtener el nombre del usuario almacenado en el localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1));
    }
  }, []);

  return (
    <div className="container-status">
      <h1>API de Vikings</h1>
      <h2>¡Hola {userName}!</h2>
      <div className="navigation">
        <Link to="/sections/staff" className="button">STAFF</Link>
        <Link to="/sections/players" className="button">JUGADORES</Link>
        <Link to="/sections/products" className="button">PRODUCTOS</Link>
        <Link to="/sections/orders" className="button">PEDIDOS</Link>
        <Link to="/sections/users" className="button">USUARIOS</Link>
        <Link to="/sections/blogs" className="button">BLOGS</Link>
      </div>
    </div>
  );
};

export default Status;