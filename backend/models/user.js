// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    lastSpin: { type: Date, default: null }, // Timestamp of last spin
    spins: { type: Number, default: 0 } // Spin count
});

module.exports = mongoose.model("User", userSchema);
