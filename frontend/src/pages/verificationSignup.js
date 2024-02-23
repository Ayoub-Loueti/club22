import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerificationSignup() {
  const { userId, token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyAccount() {
      try {
        const response = await axios.get(`http://localhost:5000/activateAccount/${userId}/${token}`);
        const { message } = response.data;
        setVerificationStatus(message);
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          setVerificationStatus(data.message);
        } else {
          console.error('Error verifying account:', error.message);
          setVerificationStatus('Error verifying account');
        }
      }
    }

    verifyAccount();
  }, [userId, token]);

  const handleLoginClick = () => {
    if (verificationStatus === 'Account activated successfully.') {
      navigate('/'); 
    }
  };

  return (
    <div>
      {verificationStatus === 'Account activated successfully.' && (
        <>
          <h1>Great! Your account is activated!</h1>
          <button onClick={handleLoginClick}>Go to Login</button>
        </>
      )}
      {verificationStatus !== 'Account activated successfully.' && (
        <h1>Verification Status: {verificationStatus}</h1>
      )}
    </div>
  );
}

export default VerificationSignup;
