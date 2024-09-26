import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './section_style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { deleteBlog } from '../functions/delete_functions';

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

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(blog => blog.id !== id)); // Actualiza el estado para eliminar el blog
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  return (
    <div className="container">
        <div className="section">
        <h2>Blogs 
          <button className="icon-button">
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
          </h2>
        <ul>
            <li className="header">
            <span>Título</span>
            <span>Contenido</span>
            <span>Fecha</span>
            <span>Autor</span>
            <span>Acciones</span>
            </li>
            {blogs.map((blog) => (
            <li key={blog.id}>
                <span>{blog.title}</span>
                <span>{blog.content}</span>
                <span>{blog.date}</span>
                <span>{blog.author}</span>
                <span>
                    <button className='edit-button'>Editar</button>
                    <button className='delete-button' onClick={() => handleDelete(blog.id)}>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Blogs;