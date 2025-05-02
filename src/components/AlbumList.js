import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AlbumList.css';

const AlbumList = ({ albums, selectAlbum }) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleClick = (album) => {
    selectAlbum(album);
    navigate('/album');
  };

  // Obtener géneros únicos
  const genres = [...new Set(albums.map((album) => album.genre))];

  // Filtrar los álbumes por género si uno está seleccionado
  const filteredAlbums = selectedGenre
    ? albums.filter((album) => album.genre === selectedGenre)
    : albums;

  return (
    <div className="albumListContainer">
      {/* Botones de filtro por género */}
      <div className="genreButtons">
      <button onClick={() => setSelectedGenre(null)} className={!selectedGenre ? 'active' : ''}>
          Todos
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={selectedGenre === genre ? 'active' : ''}
          >
            {genre}
          </button>
        ))}
        
      </div>

      {/* Lista de álbumes filtrados */}
      <div className="albumList">
        {filteredAlbums.map((album) => (
          <div key={album.id} className="albumItem" onClick={() => handleClick(album)}>
            <img src={`${process.env.PUBLIC_URL}${album.cover}`} alt={album.title} className="album__cover" />
            <h3>{album.title}</h3>
            <p>{album.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;