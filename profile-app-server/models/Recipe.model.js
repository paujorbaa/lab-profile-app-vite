const { Schema, model } = require('mongoose');

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [{ type: String }],
    instructions: { type: String },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

const Recipe = model('Recipe', recipeSchema);
module.exports = Recipe;