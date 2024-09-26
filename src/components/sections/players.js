import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import './section_style.scss';

const Players = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('https://vikingsdb.up.railway.app/players/');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players data', error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="container">
        <div className="section">
        <h2>Jugadores 
          <button className="icon-button">
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
        </h2>
        <ul>
            <li className="header">
            <span>Imagen</span>
            <span>Nombre</span>
            <span>Rol</span>
            <span>Biografía</span>
            <span>Twitter</span>
            <span>Acciones</span>
            </li>
            {players.map((player) => (
            <li key={player.id}>
                <span>{player.image}</span>
                <span>{player.name}</span>
                <span>{player.role}</span>
                <span>{player.bio}</span>
                <span>{player.twitter}</span>
                <span>
                    <button className='edit-button'>Editar</button>
                    <button className='delete-button'>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Players;