// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import AlbumList from './components/AlbumList';
import AlbumView from './components/AlbumView';
import Auth from './components/Auth';
import Profile from './components/Profile';

import './styles/App.css';

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Guardar última canción y álbum
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('lastTrack', JSON.stringify(currentTrack));
      localStorage.setItem('lastAlbum', JSON.stringify(selectedAlbum));
    }
  }, [currentTrack, selectedAlbum]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setUser(storedUser);
    }

    fetch(`${process.env.PUBLIC_URL}/musicData.json`)
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data.albums);

        // Restaurar última canción si existe
        const savedTrack = JSON.parse(localStorage.getItem('lastTrack'));
        const savedAlbum = JSON.parse(localStorage.getItem('lastAlbum'));

        if (savedTrack && savedAlbum) {
          const matchingAlbum = data.albums.find(a => a.id === savedAlbum.id);
          if (matchingAlbum) {
            setSelectedAlbum(matchingAlbum);

            const matchingTrack = matchingAlbum.tracks.find(t => t.id === savedTrack.id);
            if (matchingTrack) {
              setCurrentTrack(matchingTrack);
              setIsPlaying(false); // No reproducir automáticamente
            }
          }
        }
      })
      .catch((err) => console.error("Error cargando datos:", err));

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTrackSelect = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying((prevState) => !prevState);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        setSelectedAlbum={setSelectedAlbum}
      />

      <div className="app__body">
        <Header
          albums={albums}
          setSelectedAlbum={setSelectedAlbum}
          handleTrackSelect={handleTrackSelect}
          user={user}
          setUser={setUser}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="app__content">
          <Routes>
            <Route path="/" element={<AlbumList albums={albums} selectAlbum={setSelectedAlbum} />} />
            <Route
              path="/album"
              element={
                <AlbumView
                  album={selectedAlbum}
                  onTrackSelect={handleTrackSelect}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                />
              }
            />
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          </Routes>
        </div>
      </div>

      <div className="app__playerContainer">
        <Player
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
          album={selectedAlbum}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
}

export default App;
