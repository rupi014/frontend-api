import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { deletePlayer } from '../functions/delete_functions';
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

  const handleDelete = async (id) => {
    try {
      await deletePlayer(id);
      setPlayers(players.filter(player => player.id !== id)); // Actualiza el estado para eliminar el jugador
    } catch (error) {
      console.error('Error deleting player', error);
    }
  };

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
                    <button className='delete-button' onClick={() => handleDelete(player.id)}>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Players;