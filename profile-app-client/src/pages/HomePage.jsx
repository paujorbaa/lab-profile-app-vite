import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import RecipesGrid from '../components/RecipesGrid';
import '../styles/HomePage.css';

function HomePage() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="home-wrapper">
      <div className="home-page">
        <div className="header-box">
          <h1>Welcome to IronRecipes!</h1>
        </div>

        <div className="content-box">
          {isLoggedIn ? (
            <RecipesGrid />
          ) : (
            <>
              <h2>Share your favorite recipes with fellow Ironhackers!</h2>
              <div className="home-buttons">
                <Link to="/signup">
                  <button>Sign Up</button>
                </Link>
                <Link to="/login">
                  <button>Log In</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
