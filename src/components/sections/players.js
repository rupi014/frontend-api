import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
        <h2>Players</h2>
        <ul>
            <li className="header">
            <span>Imagen</span>
            <span>Nombre</span>
            <span>Rol</span>
            <span>Biografía</span>
            <span>Twitter</span>
            </li>
            {players.map((player) => (
            <li key={player.id}>
                <span>{player.image}</span>
                <span>{player.name}</span>
                <span>{player.role}</span>
                <span>{player.bio}</span>
                <span>{player.twitter}</span>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Players;