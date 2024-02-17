import React, { useState } from 'react';

const login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Validation du formulaire de connexion
    if (username === 'utilisateur' && password === 'motdepasse') {
      // Connexion réussie, effectuez ici votre logique de connexion
      console.log('Connexion réussie');
    } else {
      // Afficher une erreur si les identifiants sont incorrects
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <div>
        <label>Nom d'utilisateur:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Mot de passe:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Se connecter</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default login;
