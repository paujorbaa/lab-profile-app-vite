import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/AddRecipe.css';

export default function EditRecipe() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/recipes/${id}`)
      .then((res) => setForm(res.data))
      .catch(console.error);
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = form.image;

      if (newImage) {
        const data = new FormData();
        data.append('file', newImage);
        data.append('upload_preset', 'ml_default');
        data.append('cloud_name', 'deqf55e4m');

        const res = await fetch(
          'https://api.cloudinary.com/v1_1/deqf55e4m/image/upload',
          {
            method: 'POST',
            body: data,
          }
        );
        const uploaded = await res.json();
        imageUrl = uploaded.secure_url;
      }

      await api.put(`/api/recipes/${id}`, { ...form, image: imageUrl });
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error('Error updating recipe:', err);
    } finally {
      setUploading(false);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="add-recipe">
      <h2>Edit Recipe</h2>

      <form onSubmit={handleSubmit} className="recipe-form">
        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Ingredients</label>
        <input
          name="ingredients"
          value={form.ingredients.join(', ')}
          onChange={(e) =>
            setForm({
              ...form,
              ingredients: e.target.value.split(',').map((i) => i.trim()),
            })
          }
          required
        />

        <label>Instructions</label>
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          rows="4"
          required
        />

        <label>Image</label>
        <div className="image-upload">
          {form.image ? (
            <img
              src={newImage ? URL.createObjectURL(newImage) : form.image}
              alt="Recipe"
              className="preview"
            />
          ) : (
            <div className="placeholder">No image selected</div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="save-btn" disabled={uploading}>
          {uploading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
