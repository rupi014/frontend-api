import React from 'react';
import { Link } from 'react-router-dom';
import './status.scss';

const Status = () => {
  return (
    <div className="container">
      <h1>API de Vikings</h1>
      <div className="navigation">
        <Link to="/sections/staff" className="button">Staff</Link>
        <Link to="/sections/players" className="button">Players</Link>
        <Link to="/sections/products" className="button">Products</Link>
        <Link to="/sections/orders" className="button">Orders</Link>
        <Link to="/sections/blogs" className="button">Blogs</Link>
      </div>
      
    </div>
  );
};

export default Status;