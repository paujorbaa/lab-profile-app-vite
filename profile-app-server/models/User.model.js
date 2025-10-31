const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  campus: {
    type: String,
    enum: [
      'Madrid',
      'Barcelona',
      'Miami',
      'Paris',
      'Berlin',
      'Amsterdam',
      'México',
      'Sao Paulo',
      'Lisbon',
      'Remote',
    ],
  },
  course: {
    type: String,
    enum: ['Web Dev', 'UX/UI', 'Data Analytics', 'Cyber Security'],
  },
  image: { type: String },
});

const UserModel = model('User', userSchema);

module.exports = UserModel;
