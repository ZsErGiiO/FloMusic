import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Inicializa los estados de forma normal, sin condicionales
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState(user?.photo || '');


  useEffect(() => {
    if (!user) {
      navigate('/auth'); // Si no hay usuario, redirigir a la página de login
    }
  }, [user, navigate]);

  // Verifica si el usuario no está disponible y redirige, pero sin condicionales previos a los hooks
  if (!user) {
    return null; // O podrías redirigir directamente aquí también
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Elimina el usuario del almacenamiento
    setUser(null); // Limpia el estado global
    navigate('/'); // Redirige al inicio después de cerrar sesión
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Guarda directamente el Base64
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = () => {
    const updatedUser = {
      ...user,
      username,
      email,
      photo, // ya es Base64
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert('Datos guardados correctamente');
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <h2>Perfil de {username}</h2>
      </div>
      <div className="profile__info">
        <div className="profile__field">
          <label>Nombre de usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="profile__field">
          <label>Correo:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="profile__field">
          <label>Foto de perfil:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {photo && <img src={photo} alt="Foto de perfil" className="profile__photoPreview" />}
        </div>
      </div>
      <button className="profile__saveButton" onClick={handleSaveChanges}>
        Guardar cambios
      </button>
      <button className="profile__logoutButton" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Profile;
