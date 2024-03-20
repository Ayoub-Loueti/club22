import { useEffect ,useState} from 'react';
import React from 'react';
import Posts from '../posts/posts';
import PostShare from '../postShare/postShare';
import './postSide.css';
import axios from 'axios';
import PostModal from '../postModal/postModal';
const PostSide = () => {
  const [posts, setPosts] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedPostId, setSelectedPostId] = useState(null);
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
const openModalForPost = (postId) => {
  setSelectedPostId(postId);
  setIsModalOpen(true);
};
  return (
    <div className="PostSide">
      <PostShare />
      <Posts posts={posts} openModalForPost={openModalForPost} />{' '}
      {/* Pass the openModalForPost function to Posts */}
      <PostModal
        key={selectedPostId} // Unique key that changes with the post ID
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        postId={selectedPostId}
      />
    </div>
  );
};

export default PostSide;
