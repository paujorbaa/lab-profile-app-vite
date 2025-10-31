const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = model('Comment', commentSchema);
module.exports = Comment;
