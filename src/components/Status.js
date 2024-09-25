import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './status.scss';

const Status = () => {

  const [data, setData] = useState({
    staff: [],
    players: [],
    products: [],
    blogs: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, playersRes, productsRes, blogsRes] = await Promise.all([
          axios.get('https://vikingsdb.up.railway.app/staff/'),
          axios.get('https://vikingsdb.up.railway.app/players/'),
          axios.get('https://vikingsdb.up.railway.app/products/'),
          axios.get('https://vikingsdb.up.railway.app/blog/')
        ]);

        setData({
          staff: staffRes.data,
          players: playersRes.data,
          products: productsRes.data,
          blogs: blogsRes.data
        });
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>API de Vikings</h1>
      <div className="section">
        <h2>Staff</h2>
        <ul>
          {data.staff.map((member) => (
            <li key={member.id}>
                <span>{member.name}</span>
                <span>{member.role}</span>
                <span>{member.bio}</span>
                <span>{member.image}</span>
                <span>{member.twitter}</span>
            </li>
            
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Players</h2>
        <ul>
          {data.players.map((player) => (
            <li key={player.id}>
              <span>{player.image}</span>
              <span>{player.name}</span>
              <span>{player.role}</span>
              <span>{player.bio}</span>
              <span>{player.twitter}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Products</h2>
        <ul>
          {data.products.map((product) => (
            <li key={product.id}>
              <span>{product.image}</span>
              <span>{product.name}</span>
              <span>{product.description}</span>
              <span>{product.price}</span>
              <span>{product.category}</span>
              <span>{product.stock}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Blogs</h2>
        <ul>
          {data.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Status;