import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './status.scss';

const Status = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1));
    }
  }, []);

  return (
    <div className="container">
      <h1>API de Vikings</h1>
      <h2>Hola {userName}</h2>
      <div className="navigation">
        <Link to="/sections/staff" className="button">Staff</Link>
        <Link to="/sections/players" className="button">Jugadores</Link>
        <Link to="/sections/products" className="button">Productos</Link>
        <Link to="/sections/orders" className="button">Pedidos</Link>
        <Link to="/sections/blogs" className="button">Blogs</Link>
      </div>
    </div>
  );
};

export default Status;