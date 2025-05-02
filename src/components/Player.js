import React, { useRef, useState, useEffect } from 'react';
import { FaStepForward, FaStepBackward } from 'react-icons/fa';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import '../styles/Player.css';

const Player = ({ currentTrack, isPlaying, setIsPlaying, album, setCurrentTrack }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5); // Comienza con volumen al 50%

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const fullPath = `${process.env.PUBLIC_URL}${currentTrack.audio}`;
      const audio = audioRef.current;
      audio.src = fullPath;
      audio.load();
      setProgress(0);
  
      const playIfNeeded = () => {
        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn("Error al reproducir:", err);
            });
          }
        }
      };
  
      audio.oncanplay = playIfNeeded;
  
      return () => {
        audio.oncanplay = null;
      };
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        const target = e.target;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (!isInput) {
          e.preventDefault(); // Evita scroll o comportamiento por defecto
          setIsPlaying(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    audioRef.current.currentTime = newProgress;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleNext = () => {
    if (!album || !currentTrack) return;
    const currentIndex = album.tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % album.tracks.length;
    setCurrentTrack(album.tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!album || !currentTrack) return;
    const currentIndex = album.tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + album.tracks.length) % album.tracks.length;
    setCurrentTrack(album.tracks[prevIndex]);
    setIsPlaying(true);
  };

  const imageUrl = currentTrack?.cover;

  return (
    <div className="player">
      <div className="player__left">
        {currentTrack ? (
          <div className="player__details">
            {imageUrl ? (
              <img
                src={`${process.env.PUBLIC_URL}${imageUrl}`}
                alt={currentTrack.title}
                className="player__image"
              />
            ) : (
              <p>Imagen no disponible</p>
            )}
            <div>
              <h3>{currentTrack.title}</h3>
              <p>{currentTrack.artist}</p>
            </div>
          </div>
        ) : (
          <p>Cancion no seleccionada</p>
        )}
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext} // Al terminar una canción, pasa a la siguiente
      />

      <div className="player__center">
        <div className="player__controls">
          <button onClick={handlePrev} className="player__button">
            <FaStepBackward />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="player__button play-button">
            {isPlaying ? (
              <FaPauseCircle size={40} color="white" />
            ) : (
              <FaPlayCircle size={40} color="white" />
            )}
          </button>
          <button onClick={handleNext} className="player__button">
            <FaStepForward />
          </button>
        </div>

        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="player__progress"
          style={{
            '--progress': duration ? progress / duration : 0
          }}
        />
      </div>

      <div className="player__right">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="player__volume"
          style={{ '--volume': `${volume * 100}%` }} // Volumen en porcentaje
        />
      </div>
    </div>
  );
};

export default Player;
