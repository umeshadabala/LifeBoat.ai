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

// Routes - Unified for both local and Vercel environments
app.use(['/api/intelligence', '/intelligence'], intelligenceRoutes);
app.use(['/api/jobs', '/jobs'], jobRoutes);
app.use(['/api/housing', '/housing'], housingRoutes);
app.use(['/api/discovery', '/discovery'], discoveryRoutes);

app.get(['/api/health', '/health'], (req, res) => {
    res.json({ status: 'active', node: 'LifeBoat_Alpha_1' });
});

// Serve frontend in production
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*path', (req, res) => {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(__dirname, '../dist/index.html'));
        } else {
            res.status(404).json({ error: 'Endpoint Not Found', path: req.url });
        }
    });
} else {
    // 404 Catch-All Handler for API only
    app.use('/api', (req, res, next) => {
        res.status(404).json({ error: 'Endpoint Not Found', path: req.url, originalUrl: req.originalUrl });
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[LifeBoat_Backend] Strategic Uplink Active on port ${PORT}`);
    });
}

export default app;
