import { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignupForm.css';

const API_URL = import.meta.env.VITE_API_URL;

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('');
  const [course, setCourse] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleCampus = (e) => setCampus(e.target.value);
  const handleCourse = (e) => setCourse(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!campus || !course) {
      setErrorMessage('Please select a campus and course.');
      return;
    }

    const requestBody = {
      username: username.trim(),
      password: password.trim(),
      campus,
      course,
    };

    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        const errorDescription =
          error.response?.data?.message ||
          'An error occurred. Please try again.';
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignupSubmit} className="signup-form">
        <h3>Sign Up</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={handleUsername}
          autoComplete="off"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handlePassword}
          autoComplete="off"
          required
        />

        <label htmlFor="campus">Campus</label>
        <select
          name="campus"
          id="campus"
          value={campus}
          onChange={handleCampus}
          required
        >
          <option value="">Select your campus</option>
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Miami">Miami</option>
          <option value="Paris">Paris</option>
          <option value="Berlin">Berlin</option>
          <option value="Amsterdam">Amsterdam</option>
          <option value="México">México</option>
          <option value="Sao Paulo">Sao Paulo</option>
          <option value="Lisbon">Lisbon</option>
          <option value="Remote">Remote</option>
        </select>

        <label htmlFor="course">Course</label>
        <select
          name="course"
          id="course"
          value={course}
          onChange={handleCourse}
          required
        >
          <option value="">Select your course</option>
          <option value="Web Dev">Web Dev</option>
          <option value="UX/UI">UX/UI</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Cyber Security">Cyber Security</option>
        </select>

        <button type="submit">Create Account</button>

        <Link to="/login" className="login-link">
          Log in
        </Link>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default SignupPage;
