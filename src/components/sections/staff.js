import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './section_style.scss';


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

  return (  
    <div className="container">
    <div className="section">
      <h2>Staff</h2>
      <ul>
        <li className="header">
          <span>Nombre</span>
          <span>Rol</span>
          <span>Biografía</span>
          <span>Imagen</span>
          <span>Twitter</span>
        </li>
        {staff.map((member) => (
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
    </div>
  );
};

export default Staff;