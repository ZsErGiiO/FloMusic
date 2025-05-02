import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css'; // No olvides importar el nuevo Auth.css

const Auth = ({ setUser }) => {
  const [user, setLocalUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setLocalUser(storedUser);
      setUser(storedUser);
      navigate('/');
    }
  }, [navigate, setUser]);

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email === email);

    if (userExists) {
      alert('Este correo ya está registrado.');
      return;
    }

    const newUser = { username, email, password, photo: '' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setLocalUser(newUser);
    setUser(newUser);
    setEmail('');
    setPassword('');
    setUsername('');
    navigate('/');
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setLocalUser(foundUser);
      setUser(foundUser);
      setEmail('');
      setPassword('');
      navigate('/');
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  return (
    <div className="auth">
      {user ? (
        <div className="auth__card">
          <h2 className="auth__header">Bienvenido, {user.username}!</h2>
          <button className="auth__button" onClick={() => navigate('/profile')}>
            Ir a mi perfil
          </button>
        </div>
      ) : (
        <div className="auth__card">
          <h2 className="auth__header">{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</h2>
          <form className="auth__form" onSubmit={(e) => e.preventDefault()}>
            {isRegistering && (
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isRegistering ? (
              <button className="auth__button" onClick={handleRegister}>
                Registrarme
              </button>
            ) : (
              <button className="auth__button" onClick={handleLogin}>
                Entrar
              </button>
            )}
          </form>
          <p className="auth__toggle" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
