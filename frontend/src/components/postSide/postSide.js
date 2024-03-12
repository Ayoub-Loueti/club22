import { useEffect ,useState} from 'react';
import React from 'react';
import Posts from '../posts/posts';
import PostShare from '../postShare/postShare';
import './postSide.css';
import axios from 'axios';

const PostSide = () => {
  const [posts, setPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('login'))?.token; 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data); // Stocker les posts dans l'état
      } catch (error) {
        console.error('Erreur lors du chargement des posts', error);
      }
    };

    fetchPosts();
  }, [token]);

  return (
    <div className="PostSide">
      <PostShare />
      <Posts posts={posts} /> {/* Passer les posts au composant Posts */}
    </div>
  );
};

export default PostSide;
