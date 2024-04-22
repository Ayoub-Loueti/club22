import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import './AdminSignalsPage.css';
import PostModal from '../../../components/postModal/postModal'; // Import the PostModal you use elsewhere in your app

const AdminSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const token = JSON.parse(localStorage.getItem('login'))?.token;

  useEffect(() => {
    fetchSignals();
  }, []);

const fetchSignals = async () => {
  try {
    const response = await axios.get('http://localhost:5000/signaler', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data); // Check the structure here
    setSignals(response.data);
  } catch (error) {
    console.error('Error fetching signals:', error);
    Swal.fire('Error', 'Failed to fetch signals.', 'error');
  }
};


  const openPostModal = (postId) => {
    setSelectedPostId(postId);
    setIsPostModalOpen(true);
  };

  return (
    <div className="adminSignalsContainer">
      <h2>Reported Content Management</h2>
      {signals.length > 0 ? (
        signals.map((signal) => (
          <div key={signal.id_signaler} className="signal-item">
            <p>
              Reported by:{' '}
              <NavLink to={`/profil/${signal.utilisateur.id_utilisateur}`}>
                {signal.utilisateur.prenom} {signal.utilisateur.nom}
              </NavLink>
            </p>
            <p>
              Type:{' '}
              {signal.post ? 'Post' : signal.comment ? 'Comment' : 'Response'}
            </p>
            <button onClick={() => openPostModal(signal.post.id_post)}>
              View Content
            </button>
          </div>
        ))
      ) : (
        <p>No reports to show.</p>
      )}
      <PostModal
        isOpen={isPostModalOpen}
        onRequestClose={() => setIsPostModalOpen(false)}
        postId={selectedPostId}
      />
    </div>
  );
};

export default AdminSignalsPage;
