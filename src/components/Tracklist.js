import React from 'react';
import '../styles/Tracklist.css';
import { Play, Pause } from 'lucide-react';

const Tracklist = ({ album, onTrackSelect, currentTrack, isPlaying }) => {
  if (!album) return null;

  return (
    <div className="tracklist">
      <div className="tracklist__header">
        <div className="tracklist__left">Título</div>
        <div className="tracklist__right">Duración</div>
      </div>

      {album.tracks.map((track, index) => {
        const isCurrent = currentTrack && currentTrack.id === track.id;

        return (
          <div
            className="tracklist__row"
            key={track.id}
            onClick={() => onTrackSelect(track)}
          >
            <div className="tracklist__left">
              <div className="tracklist__thumbnail">
              <img src={`${process.env.PUBLIC_URL}${album.cover}`} alt={album.title} className="tracklist__cover" />
                <div className="tracklist__play">
                  {isCurrent && isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                </div>
              </div>
              <div>
                <div>{track.title}</div>
                <div className="tracklist__artist">{album.artist}</div>
              </div>
            </div>
            <div className="tracklist__right">{track.duration}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Tracklist;