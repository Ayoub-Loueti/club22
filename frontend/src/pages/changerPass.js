import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ChangerPass() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
        newPassword: newPassword
      });

      alert(response.data.message); 
      // Redirect or perform any other actions upon successful password reset

    } catch (error) {
      // Handle error
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleResetPasswordSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <button type="submit" disabled={loading}>Reset Password</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default ChangerPass;
