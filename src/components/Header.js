import React, { useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Header.css';

const Header = ({ albums, setSelectedAlbum, handleTrackSelect, user, setUser }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleBack = () => navigate(-1);
  const handleForward = () => navigate(1);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredTracks([]);
      return;
    }

    const results = [];
    albums.forEach(album => {
      album.tracks.forEach(track => {
        if (
          track.title.toLowerCase().includes(value.toLowerCase()) ||
          track.artist.toLowerCase().includes(value.toLowerCase())
        ) {
          results.push({ ...track, album });
        }
      });
    });

    setFilteredTracks(results);
  };

  const handleTrackClick = (track) => {
    setSelectedAlbum(track.album);
    handleTrackSelect(track);
    navigate('/album');
    setSearchTerm('');
    setFilteredTracks([]);
    setMobileSearchOpen(false);
  };

  const handleUserIconClick = () => {
    navigate(user ? '/profile' : '/auth');
  };

  return (
    <div className="header">
      <div className="header__navButtons">
        <button onClick={handleBack} className="header__arrowButton">
          <GoChevronLeft size={40} />
        </button>
        <button onClick={handleForward} className="header__arrowButton">
          <GoChevronRight size={40} />
        </button>
      </div>

      {/* Desktop search */}
      <div className="header__searchContainer desktop-only">
        <div className="header__search">
          <input
            type="text"
            placeholder="Buscar canciones, artistas..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FaSearch className="header__searchIcon" />
        </div>

        <AnimatePresence>
          {searchTerm && filteredTracks.length > 0 && (
            <motion.div
              className="header__searchDropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  className="header__suggestionItem"
                  onClick={() => handleTrackClick(track)}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}${track.album.cover}`}
                    alt={track.album.title}
                    className="header__suggestionImage"
                  />
                  <div className="header__suggestionText">
                    <div className="header__suggestionTitle">{track.title}</div>
                    <div className="header__suggestionArtist">{track.artist}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile search icon */}
      <div className="header__mobileSearchIcon mobile-only">
        <FaSearch onClick={() => setMobileSearchOpen(true)} />
      </div>

      <div className="header__user">
        {user ? (
          <div className="header__userInfo" onClick={handleUserIconClick}>
            <img
              src={user.photo || `${process.env.PUBLIC_URL}/logo/perfil_predeterminado.jpg`}
              alt="Foto de perfil"
              className="header__userPhoto"
            />
            <span>{user.username}</span>
          </div>
        ) : (
          <FaUserCircle className="header__userIcon" onClick={handleUserIconClick} />
        )}
      </div>

      {/* Mobile search full screen */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            className="header__mobileSearchOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="header__mobileSearchBox">
              <input
                type="text"
                placeholder="Buscar canciones, artistas..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
              />
              <button className="header__mobileCloseBtn" onClick={() => setMobileSearchOpen(false)}>Cerrar</button>
            </div>

            {filteredTracks.length > 0 && (
              <div className="header__mobileSuggestions">
                {filteredTracks.map((track) => (
                  <div
                    key={track.id}
                    className="header__suggestionItem"
                    onClick={() => handleTrackClick(track)}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}${track.album.cover}`}
                      alt={track.album.title}
                      className="header__suggestionImage"
                    />
                    <div className="header__suggestionText">
                      <div className="header__suggestionTitle">{track.title}</div>
                      <div className="header__suggestionArtist">{track.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
