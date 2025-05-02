import React from 'react';
import Tracklist from './Tracklist';
import '../styles/AlbumView.css';

const AlbumView = ({ album, onTrackSelect }) => {
  if (!album) return null;

  return (
    <div className="album-view">
      <div className="albumView__header">
      <img src={`${process.env.PUBLIC_URL}${album.cover}`} alt={album.title} className="albumView__cover" />
        <div className="albumView__info">
          <h2 className="albumView__title">{album.title}</h2>
          <p className="albumView__artist">{album.artist}</p>
        </div>
        
      </div>

      <div className="albumView__content">
        <Tracklist album={album} onTrackSelect={onTrackSelect} />
      </div>
    </div>
  );
};

export default AlbumView;