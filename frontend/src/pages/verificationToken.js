import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerificationToken() {
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/check-reset-token', {
        resetPasswordToken: resetToken
      });

      if (response.data.isValid) {
        // Token is valid, navigate to the next page
        navigate(`/changerPass/${resetToken}`);
      } else {
        // Token is invalid, display an alert
        alert('Invalid reset password token. Please try again.');
      }
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
      <h2>Enter Reset Password Token</h2>
      <form onSubmit={handleResetTokenSubmit}>
        <input
          type="text"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          placeholder="Enter reset password token"
          required
        />
        <button type="submit" disabled={loading}>OK</button>
      </form>
    </div>
  );
}

export default VerificationToken;
