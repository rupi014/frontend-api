import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { deleteStaff } from '../functions/delete_functions';
import { addStaff } from '../functions/create_functions'; 
import { updateStaff } from '../functions/edit_functions';
import './section_style.scss';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    bio: '',
    twitter: '',
    image: ''
  });
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('https://vikingsdb.up.railway.app/staff/');
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff data', error);
      }
    };

    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteStaff(id);
      setStaff(staff.filter(member => member.id !== id));
    } catch (error) {
      console.error('Error deleting staff member', error);
    }
  };

  const handleAddStaff = async () => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default');
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const addedStaff = await addStaff({ ...newStaff, image: imageUrl });
      setStaff([...staff, addedStaff]);
      setNewStaff({ name: '', role: '', bio: '', twitter: '', image: '' });
      setImageFile(null);
    } catch (error) {
      console.error('Error adding staff member', error);
    }
  };

  const handleEditStaff = (member) => {
    setStaffToEdit(member);
    setNewStaff(member);
  };

  const handleUpdateStaff = async () => {
    try {
      let imageUrl = newStaff.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default');
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const updatedStaff = await updateStaff(staffToEdit.id, { ...newStaff, image: imageUrl });
      setStaff(staff.map(member => (member.id === staffToEdit.id ? updatedStaff : member)));
      setStaffToEdit(null);
      setNewStaff({ name: '', role: '', bio: '', twitter: '', image: '' });
      setImageFile(null);
      // Refrescar la lista de staff después de actualizar
      const response = await axios.get('https://vikingsdb.up.railway.app/staff/');
      setStaff(response.data);
    } catch (error) {
      console.error('Error updating staff member', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div className="container">
        <div className="section">
        <h2>Staff</h2>
        <ul>
            <li className="header">
            <span>Imagen</span>
            <span>Nombre</span>
            <span>Rol</span>
            <span>Biografía</span>
            <span>Twitter</span>
            <span>Acciones</span>
            </li>
            {staff.map((member) => (
            <li key={member.id}>
              <span>
                  {member.image ? (
                    <img src={member.image} alt={member.name} style={{ width: '50px', height: '50px' }} />
                  ) : (
                    'No Image'
                  )}
                </span>
                <span>{member.name}</span>
                <span>{member.role}</span>
                <span>{member.bio}</span>
                <span>{member.twitter}</span>
                <span>
                    <button className='edit-button' onClick={() => handleEditStaff(member)}>Editar</button>
                    <button className='delete-button' onClick={() => handleDelete(member.id)}>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
        <div className="section">
          <h2>{staffToEdit ? 'Editar Miembro del Staff' : 'Añadir Miembro del Staff'}</h2>
          <form className="create-form">
            <label>Nombre:</label>
            <input type="text" name="name" value={newStaff.name} onChange={handleChange} />
            <label>Rol:</label>
            <input type="text" name="role" value={newStaff.role} onChange={handleChange} />
            <label>Biografía:</label>
            <input type="text" name="bio" value={newStaff.bio} onChange={handleChange} />
            <label>Twitter:</label>
            <input type="text" name="twitter" value={newStaff.twitter} onChange={handleChange} />
            <label>Imagen:</label>
            <input type="file" name="image" onChange={handleImageChange} />
            <button type="button" onClick={staffToEdit ? handleUpdateStaff : handleAddStaff}>
              {staffToEdit ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
    </div>
  );
};

export default Staff;