import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import intelligenceRoutes from './routes/intelligence.js';
import jobRoutes from './routes/jobs.js';
import housingRoutes from './routes/housing.js';
import discoveryRoutes from './routes/discovery.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/housing', housingRoutes);
app.use('/api/discovery', discoveryRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'active', node: 'LifeBoat_Alpha_1' });
});

// 404 Catch-All Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint Not Found', path: req.url, originalUrl: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[LifeBoat_Backend] Strategic Uplink Active on port ${PORT}`);
    });
}

export default app;
