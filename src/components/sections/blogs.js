import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://vikingsdb.up.railway.app/blog/');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs data', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="section">
      <h2>Blogs</h2>
      <ul>
        <li className="header">
          <span>Título</span>
          <span>Contenido</span>
          <span>Fecha</span>
          <span>Autor</span>
        </li>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <span>{blog.title}</span>
            <span>{blog.content}</span>
            <span>{blog.date}</span>
            <span>{blog.author}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;