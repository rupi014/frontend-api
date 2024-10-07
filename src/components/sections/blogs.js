import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import './section_style.scss';
import { deleteBlog } from '../functions/delete_functions';
import { addBlog } from '../functions/create_functions';
import { updateBlog } from '../functions/edit_functions';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    date: '',
    author_id: '',
    image: ''
  });
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este blog?");
    if (!confirmDelete) return;

    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  const handleAddBlog = async () => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default'); // Asegúrate de que 'ml_default' sea correcto
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const addedBlog = await addBlog({ ...newBlog, image: imageUrl });
      setBlogs([...blogs, addedBlog]);
      setNewBlog({ title: '', content: '', date: '', author_id: '', image: '' });
      setImageFile(null);
    } catch (error) {
      console.error('Error adding blog', error);
    }
  };

  const handleEditBlog = (blog) => {
    if (blogToEdit && blogToEdit.id === blog.id) {
      // Si ya estamos editando este blog, salir del modo edición
      setBlogToEdit(null);
      setNewBlog({ title: '', content: '', date: '', author_id: '', image: '' });
    } else {
      // Entrar en modo edición para el blog seleccionado
      setBlogToEdit(blog);
      setNewBlog({
        title: blog.title || '',
        content: blog.content || '',
        date: blog.date ? blog.date.split('T')[0] : '',
        author_id: blog.author_id || '',
        image: blog.image || ''
      });
    }
  };

  const handleUpdateBlog = async () => {
    try {
      let imageUrl = newBlog.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default'); // Asegúrate de que 'ml_default' sea correcto
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const updatedBlog = await updateBlog(blogToEdit.id, { ...newBlog, image: imageUrl });
      setBlogs(blogs.map(blog => (blog.id === blogToEdit.id ? updatedBlog : blog)));
      setBlogToEdit(null);
      setNewBlog({ title: '', content: '', date: '', author_id: '', image: '' });
      setImageFile(null);
      // Refrescar la lista de blogs después de actualizar
      const response = await axios.get('https://vikingsdb.up.railway.app/blog/');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error updating blog', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleContentChange = (content) => {
    setNewBlog({ ...newBlog, content });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const truncateContent = (content) => {
    const words = content.split(' ');
    return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : content;
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Blogs</h2>
        <ul>
          <li className="header">
            <span>Imagen</span>
            <span>Título</span>
            <span>Contenido</span>
            <span>Fecha</span>
            <span>Autor</span>
            <span>Acciones</span>
          </li>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <span>
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} style={{ width: '50px', height: '50px' }} />
                ) : (
                  'No Image'
                )}
              </span>
              <span>{blog.title}</span>
              <span>{truncateContent(blog.content)}</span>
              <span>{blog.date.split('T')[0]}</span>
              <span>{blog.author_id}</span>
              <span>
                <button className={`edit-button ${blogToEdit && blogToEdit.id === blog.id ? 'hover' : ''}`}
                  onClick={() => handleEditBlog(blog)}>
                  {blogToEdit && blogToEdit.id === blog.id ? 'Cancelar' : 'Editar'}
                </button>
                <button className='delete-button' onClick={() => handleDelete(blog.id)}>Eliminar</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>{blogToEdit ? 'Editar Blog' : 'Añadir Blog'}</h2>
        <form className="create-form">
          <label>Título:</label>
          <input type="text" name="title" value={newBlog.title} onChange={handleChange} />
          <label>Contenido:</label>
          <Editor
            apiKey="8hyhnh1u0q899xxtr0m8zplw4s64u66kswnewdj3smav0kj1" // Reemplaza con tu clave de API de TinyMCE
            value={newBlog.content}
            init={{
              height: 300,
              width: '100%',
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                `undo redo | formatselect | bold italic backcolor | 
                alignleft aligncenter alignright alignjustify | 
              bullist numlist outdent indent | removeformat | help`
            }}
            onEditorChange={handleContentChange}
          />
          <label>Fecha:</label>
          <input type="date" name="date" value={newBlog.date} onChange={handleChange} />
          <label>Autor:</label>
          <input type="text" name="author_id" value={newBlog.author_id} onChange={handleChange} />
          <label>Imagen:</label>
          <input type="file" name="image" onChange={handleImageChange} />
          <button type="button" onClick={blogToEdit ? handleUpdateBlog : handleAddBlog}>
            {blogToEdit ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Blogs;