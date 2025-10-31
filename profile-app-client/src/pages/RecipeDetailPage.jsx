import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import CommentSection from '../components/CommentSection';
import '../styles/RecipeDetails.css';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  const fetchRecipe = () => {
    api
      .get(`/api/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleDelete = () => {
    api
      .delete(`/api/recipes/${id}`)
      .then(() => navigate('/recipes'))
      .catch((err) => console.error(err));
  };

  if (!recipe) return <p>Loading...</p>;

  const currentUser = JSON.parse(
    atob(localStorage.getItem('authToken').split('.')[1])
  );

  return (
    <div className="recipe-detail">
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      <p>
        <b>Ingredients:</b> {recipe.ingredients?.join(', ')}
      </p>
      <p>
        <b>Instructions:</b> {recipe.instructions}
      </p>
      {recipe.image && <img src={recipe.image} alt={recipe.title} />}

      <p>By: {recipe.author?.username}</p>

      {recipe.author?._id === currentUser._id && (
        <div className="actions">
          <Link to={`/recipes/${id}/edit`} className="edit-btn">
            <span></span> Edit
          </Link>
          <button className="delete-btn" onClick={handleDelete} title="Delete">
            ✕
          </button>
        </div>
      )}

      <CommentSection recipeId={id} />
    </div>
  );
}
