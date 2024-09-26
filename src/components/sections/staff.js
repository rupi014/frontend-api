import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './section_style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { deleteStaff } from '../functions/delete_functions';

const Staff = () => {
  const [staff, setStaff] = useState([]);

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
      setStaff(staff.filter(member => member.id !== id)); // Actualiza el estado para eliminar el miembro del staff
    } catch (error) {
      console.error('Error deleting staff member', error);
    }
  };

  return (  
    <div className="container">
    <div className="section">
      <h2>Staff 
        <button className="icon-button">
            <FontAwesomeIcon icon={faSquarePlus} />
        </button>
        </h2>
      <ul>
        <li className="header">
          <span>Nombre</span>
          <span>Rol</span>
          <span>Biografía</span>
          <span>Imagen</span>
          <span>Twitter</span>
          <span>Acciones</span>
        </li>
        {staff.map((member) => (
          <li key={member.id}>
            <span>{member.name}</span>
            <span>{member.role}</span>
            <span>{member.bio}</span>
            <span>{member.image}</span>
            <span>{member.twitter}</span>
            <span>
              <button className='edit-button'>Editar</button>
              <button className='delete-button' onClick={() => handleDelete(member.id)}>Eliminar</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Staff;