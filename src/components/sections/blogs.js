import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './section_style.scss';
import { deleteBlog } from '../functions/delete_functions';
import { addBlog } from '../functions/create_functions';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    date: '',
    author: ''
  });

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

  const handleAddBlog = async () => {
    try {
      const addedBlog = await addBlog(newBlog);
      setBlogs([...blogs, addedBlog]); // Actualiza el estado para añadir el nuevo blog
      setNewBlog({ title: '', content: '', date: '', author: '' }); // Limpia el formulario
    } catch (error) {
      console.error('Error adding blog', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  return (
    <div className="container">
        <div className="section">
        <h2>Blogs</h2>
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
                <span>{blog.author_id}</span>
                <span>
                    <button className='edit-button'>Editar</button>
                    <button className='delete-button' onClick={() => handleDelete(blog.id)}>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
        <div className="section">
          <h2>Añadir Blog</h2>
          <form className="create-form">
            <label>Título:</label>
            <input type="text" name="title" value={newBlog.title} onChange={handleChange} />
            <label>Contenido:</label>
            <input type="text" name="content" value={newBlog.content} onChange={handleChange} />
            <label>Imagen:</label>
            <input type="text" name="image" value={newBlog.image} onChange={handleChange} />
            <label>Fecha:</label>
            <input type="date" name="date" value={newBlog.date} onChange={handleChange} />
            <label>Autor:</label>
            <input type="text" name="author_id" value={newBlog.author_id} onChange={handleChange} />
            <button type="button" onClick={handleAddBlog}>Crear</button>
          </form>
        </div>
    </div>
  );
};

export default Blogs;