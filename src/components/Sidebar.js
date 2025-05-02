import React, { useState } from 'react';
import { FaHome, FaSearch, FaBook, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ setSelectedAlbum }) => {
  const [isOpen, setIsOpen] = useState(true); // Estado para controlar la visibilidad
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Cambiar el estado de visibilidad
  };

  return (
    <div>
      {/* Botón para abrir/cerrar el sidebar en pantallas pequeñas */}
      <button className="sidebar__toggleButton" onClick={toggleSidebar}>
        <FaBars className="sidebar__toggleIcon" />
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar__logo">
          <img
            src={`${process.env.PUBLIC_URL}/logo/LogoFloMusicBlanco.png`}
            alt="logo"
            className="Sidebar__logo"
          />
        </div>
        <div className="sidebar__menu">
          <div
            className="sidebar__menuItem"
            onClick={() => {
              setSelectedAlbum(null);
              navigate('/');
            }}
          >
            <FaHome className="sidebar__icon" />
            <p>Inicio</p>
          </div>
          <div className="sidebar__menuItem" onClick={() => navigate('/search')}>
            <FaSearch className="sidebar__icon" />
            <p>Buscar</p>
          </div>
          <div className="sidebar__menuItem" onClick={() => navigate('/library')}>
            <FaBook className="sidebar__icon" />
            <p>Tu biblioteca</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
