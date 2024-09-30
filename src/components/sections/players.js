import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { deletePlayer } from '../functions/delete_functions';
import { addPlayer } from '../functions/create_functions';
import { updatePlayer } from '../functions/edit_functions';
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
  const [playerToEdit, setPlayerToEdit] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este jugador?");
    if (!confirmDelete) return;

    try {
      await deletePlayer(id);
      setPlayers(players.filter(player => player.id !== id));
    } catch (error) {
      console.error('Error deleting player', error);
    }
  };

  const handleAddPlayer = async () => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default');
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const addedPlayer = await addPlayer({ ...newPlayer, image: imageUrl });
      setPlayers([...players, addedPlayer]);
      setNewPlayer({ name: '', role: '', bio: '', twitter: '', image: '' });
      setImageFile(null);
    } catch (error) {
      console.error('Error adding player', error);
    }
  };

  const handleEditPlayer = (player) => {
    setPlayerToEdit(player);
    setNewPlayer(player);
  };

  const handleUpdatePlayer = async () => {
    try {
      let imageUrl = newPlayer.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default');
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const updatedPlayer = await updatePlayer(playerToEdit.id, { ...newPlayer, image: imageUrl });
      setPlayers(players.map(player => (player.id === playerToEdit.id ? updatedPlayer : player)));
      setPlayerToEdit(null);
      setNewPlayer({ name: '', role: '', bio: '', twitter: '', image: '' });
      setImageFile(null);
      const response = await axios.get('https://vikingsdb.up.railway.app/players/');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error updating player', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer({ ...newPlayer, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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
              <span>
                {player.image ? (
                  <img src={player.image} alt={player.name} style={{ width: '50px', height: '50px' }} />
                ) : (
                  'No Image'
                )}
              </span>
              <span>{player.name}</span>
              <span>{player.role}</span>
              <span>{player.bio}</span>
              <span>{player.twitter}</span>
              <span>
                <button className='edit-button' onClick={() => handleEditPlayer(player)}>Editar</button>
                <button className='delete-button' onClick={() => handleDelete(player.id)}>Eliminar</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>{playerToEdit ? 'Editar Jugador' : 'Añadir Jugador'}</h2>
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
          <input type="file" name="image" onChange={handleImageChange} />
          <button type="button" onClick={playerToEdit ? handleUpdatePlayer : handleAddPlayer}>
            {playerToEdit ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Players;