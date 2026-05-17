const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: { type: String, default: 'admin' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AdminProfile', profileSchema);
