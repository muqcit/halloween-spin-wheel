require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// Configure CORS to allow requests only from your frontend
app.use(cors()); // Replace with your frontend's origin

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error connecting to MongoDB:", error));

// Define routes here
const User = require("./models/user");

// Register a new user
app.post("/register", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            // Create user if not found
            user = new User({ email });
            await user.save();
            return res.status(201).json({ message: "User registered", user });
        } else {
            return res.status(200).json({ message: "User already registered", user });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});

// Allow user to spin if 24 hours have passed since the last spin
app.get("/spin", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentTime = new Date();
        const lastSpinTime = user.lastSpin ? new Date(user.lastSpin) : null;
        const timeDifference = lastSpinTime ? (currentTime - lastSpinTime) / (1000 * 60 * 60 * 24) : null;

        // Check if 24 hours have passed
        if (!lastSpinTime || timeDifference >= 1) {
            user.lastSpin = currentTime; // Update the last spin time
            user.spins += 1; // Increment the spin count
            await user.save();
            return res.status(200).json({ message: "Spin allowed", spins: user.spins });
        } else {
            const hoursRemaining = 24 - timeDifference * 24;
            return res.status(201).json({ message: `Please wait ${hoursRemaining.toFixed(2)} more hours` });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
