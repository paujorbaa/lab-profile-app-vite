import { useEffect, useState } from 'react';
import api from '../api';
import '../styles/CommentSection.css';

export default function CommentSection({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const fetchComments = () => {
    api
      .get(`/api/comments/${recipeId}`)
      .then((res) => setComments(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post(`/api/comments/${recipeId}`, { text })
      .then(() => {
        setText('');
        fetchComments();
      })
      .catch(console.error);
  };

  const handleDelete = (commentId) => {
    api
      .delete(`/api/comments/${commentId}`)
      .then(() => fetchComments())
      .catch(console.error);
  };

  const currentUser = JSON.parse(
    atob(localStorage.getItem('authToken').split('.')[1])
  );

  return (
    <div className="comment-section">
      <h3>Comments</h3>

      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Post</button>
      </form>

      <ul>
        {comments.map((c) => (
          <li key={c._id}>
            <span>
              <b>{c.author?.username}:</b> {c.text}
            </span>
            {c.author?._id === currentUser._id && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(c._id)}
                title="Delete comment"
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
