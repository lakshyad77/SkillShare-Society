const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null initially if broadcasting
    requiredSkill: { type: String, required: true },
    requestedTime: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' },
    distance: { type: Number }, // Distance in km
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);
