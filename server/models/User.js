const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  apartmentName: { type: String, required: true },
  block: { type: String, required: true },
  flatNumber: { type: String, required: true },
  skillsOffered: [{ type: String }],
  availability: [{ type: String, enum: ['Morning', 'Evening', 'Weekend'] }],
  latitude: { type: Number },
  longitude: { type: Number },
  role: { type: String, enum: ['Requester', 'Worker', 'Both'], default: 'Requester' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
