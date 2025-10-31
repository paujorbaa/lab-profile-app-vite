import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/recipespage.css';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api
      .get('/api/recipes')
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="recipes-page">
      <h2>Community Recipes</h2>

      <div className="recipes-grid">
        {recipes.map((r) => (
          <div className="recipe-card" key={r._id}>
            <Link to={`/recipes/${r._id}`}>
              <img
                src={
                  r.image || 'https://via.placeholder.com/300x200?text=No+Image'
                }
                alt={r.title}
              />
              <div className="recipe-info">
                <h3>{r.title}</h3>
                <p>by {r.author?.username || 'Unknown'}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="recipes-header">
        <Link to="/recipes/new" className="add-btn">
          Press here to share your own recipes!
        </Link>
      </div>
    </div>
  );
}
