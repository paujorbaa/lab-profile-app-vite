import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/AddRecipe.css';

export default function AddRecipe() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    image: null,
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('instructions', form.instructions);
      formData.append(
        'ingredients',
        form.ingredients.split(',').map((i) => i.trim())
      );
      if (form.image) formData.append('image', form.image);

      await api.post('/api/recipes/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/recipes');
    } catch (err) {
      console.error('Error uploading recipe:', err);
      alert('Something went wrong while uploading your recipe.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-recipe">
      <h2>Add New Recipe</h2>

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
          placeholder="e.g. Eggs, Flour, Milk"
          value={form.ingredients}
          onChange={handleChange}
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
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        {form.image && (
          <p className="file-name">Selected file: {form.image.name}</p>
        )}

        <button type="submit" className="save-btn" disabled={uploading}>
          {uploading ? 'Saving...' : 'Save Recipe'}
        </button>
      </form>
    </div>
  );
}
