import React, { useEffect, useState } from 'react';
import axios from 'axios';


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
    <div className="section">
      <h2>Staff</h2>
      <ul>
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
  );
};

export default Staff;