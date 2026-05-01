const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. BULLETPROOF CORS CONFIGURATION (This fixes the preflight error!)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. INCREASED FILE SIZE LIMITS (This fixes the 500 Internal Server Error)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB Atlas (Modern Version)
const MONGODB_URI = "mongodb+srv://reajulAdmin:RiN1cVeGn47ozhVl@myportfolio.xpuoop6.mongodb.net/portfolioDB?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch(err => console.error('❌ MongoDB Error:', err));

const PortfolioSchema = new mongoose.Schema({
    profile: Object,
    socials: Object,
    skills: Array,
    timeline: Array,
    projects: Array
}, { strict: false });

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

// POST: Save Admin Data
app.post('/api/portfolio/update', async (req, res) => {
    try {
        await Portfolio.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ message: 'Failed', error: error.message });
    }
});

// GET: Fetch Data for 3D Frontend
app.get('/api/portfolio', async (req, res) => {
    try {
        const data = await Portfolio.findOne();
        res.status(200).json(data);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ message: 'Failed', error: error.message });
    }
});

// RUN ON PORT 5001
app.listen(5001, () => console.log(`🚀 Backend running on http://localhost:5001`));