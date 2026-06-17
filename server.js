const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: "healthy",
        message: "Welcome to your shipFlow deployed application!",
        timestamp: new Date(),
        environment: {
            PORT: PORT,
            HAS_MONGO_URI: !!MONGODB_URI
        }
    });
});

app.get('/db-status', async (req, res) => {
    if (!MONGODB_URI) {
        return res.status(500).json({
            status: "error",
            message: "MONGODB_URI environment variable is missing!"
        });
    }

    try {
        const connection = await mongoose.connect(MONGODB_URI);
        await connection.connection.db.admin().ping();
        await mongoose.disconnect();

        res.status(200).json({
            status: "connected",
            message: "Successfully authenticated and connected to MongoDB Atlas via shipFlow env injection!"
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to connect to MongoDB using the provided URI.",
            error: error.message
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test application running smoothly on port ${PORT}`);
});