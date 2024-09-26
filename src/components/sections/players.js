import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { deletePlayer } from '../functions/delete_functions';
import { addPlayer } from '../functions/create_functions';
import './section_style.scss';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    role: '',
    bio: '',
    twitter: '',
    image: ''
  });

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

  const handleAddPlayer = async () => {
    try {
      const addedPlayer = await addPlayer(newPlayer);
      setPlayers([...players, addedPlayer]); // Actualiza el estado para añadir el nuevo jugador
      setNewPlayer({ name: '', role: '', bio: '', twitter: '', image: '' }); // Limpia el formulario
    } catch (error) {
      console.error('Error adding player', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer({ ...newPlayer, [name]: value });
  };

  return (
    <div className="container">
        <div className="section">
        <h2>Jugadores</h2>
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
        <div className="section">
          <h2>Añadir Jugador</h2>
          <form className="create-form">
            <label>Nombre:</label>
            <input type="text" name="name" value={newPlayer.name} onChange={handleChange} />
            <label>Rol:</label>
            <input type="text" name="role" value={newPlayer.role} onChange={handleChange} />
            <label>Biografía:</label>
            <input type="text" name="bio" value={newPlayer.bio} onChange={handleChange} />
            <label>Twitter:</label>
            <input type="text" name="twitter" value={newPlayer.twitter} onChange={handleChange} />
            <label>Imagen:</label>
            <input type="text" name="image" value={newPlayer.image} onChange={handleChange} />
            <button type="button" onClick={handleAddPlayer}>Crear</button>
          </form>
        </div>
    </div>
  );
};

export default Players;