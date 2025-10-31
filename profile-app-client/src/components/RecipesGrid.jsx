import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/recipes.css';

export default function RecipesGrid() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api
      .get('/api/recipes')
      .then((res) => {
        const hardcodedIds = [
          '69037954690214b7f9ef8801',
          '69037954690214b7f9ef8802',
          '69037954690214b7f9ef8803',
        ];

        const chosenOnes = res.data.filter((r) => hardcodedIds.includes(r._id));

        setRecipes(chosenOnes);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="recipes-page">
      <h2 className="today-title">Check out today's picks!</h2>

      <div className="recipes-header"></div>

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
      <Link to="/recipes" className="add-btn">
        Want to see more?
      </Link>
    </div>
  );
}
