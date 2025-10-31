import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const { user, logOutUser, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: user?.username || '',
    campus: user?.campus || '',
    course: user?.course || '',
    image: user?.image || '',
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = () => {
    setUploading(true);
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'deqf55e4m',
        uploadPreset: 'ml_default',
        folder: 'profiles',
        sources: ['local', 'camera'],
        multiple: false,
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          setForm((prev) => ({ ...prev, image: result.info.secure_url }));
        }
        setUploading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/api/users', form);
      setUser(res.data.user);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  const handleLogout = () => {
    logOutUser();
    navigate('/');
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2>My Profile</h2>

        <div className="profile-image-section">
          <img
            src={form.image || '/default-avatar.png'}
            alt="Profile"
            className="profile-avatar"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={uploading}
            className="upload-btn"
          >
            {uploading ? 'Uploading...' : 'Change Picture'}
          </button>
        </div>

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          autoComplete="off"
        />

        <label>Campus</label>
        <select
          name="campus"
          value={form.campus}
          onChange={handleChange}
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

        <label>Course</label>
        <select
          name="course"
          value={form.course}
          onChange={handleChange}
          required
        >
          <option value="">Select your course</option>
          <option value="Web Dev">Web Dev</option>
          <option value="UX/UI">UX/UI</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Cyber Security">Cyber Security</option>
        </select>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </form>
    </div>
  );
}
