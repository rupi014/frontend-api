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

  // Obtener los miembros del staff
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

  // Eliminar un miembro del staff
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este miembro del staff?");
    if (!confirmDelete) return;

    try {
      await deleteStaff(id);
      setStaff(staff.filter(member => member.id !== id));
    } catch (error) {
      console.error('Error deleting staff member', error);
    }
  };

  // Añadir un nuevo miembro del staff
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

  // Editar un miembro del staff
  const handleEditStaff = (member) => {
    if (staffToEdit && staffToEdit.id === member.id) {
      // Si ya estamos editando este miembro, salir del modo edición
      setStaffToEdit(null);
      setNewStaff({ name: '', role: '', bio: '', twitter: '', image: '' });
    } else {
      // Entrar en modo edición para el miembro seleccionado
      setStaffToEdit(member);
      setNewStaff(member);
    }
  };

  // Actualizar un miembro del staff
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

  // Agrupar miembros del staff por rol
  const groupedStaff = staff.reduce((acc, member) => {
    const { role } = member;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {});

  return (
    <div className="container">
      <div className="section">
        <h2>Staff</h2>
        <ul>
          {Object.keys(groupedStaff).map((role) => (
            <React.Fragment key={role}>
              <span className='role-header'>{role}</span>
              {groupedStaff[role].map((member) => (
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
                    <button className={`edit-button ${staffToEdit && staffToEdit.id === member.id ? 'hover' : ''}`}
                      onClick={() => handleEditStaff(member)}>
                      {staffToEdit && staffToEdit.id === member.id ? 'Cancelar' : 'Editar'}
                    </button>
                    <button className='delete-button' onClick={() => handleDelete(member.id)}>Eliminar</button>
                  </span>
                </li>
              ))}
            </React.Fragment>
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