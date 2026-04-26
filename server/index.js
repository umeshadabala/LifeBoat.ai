const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const intelligenceRoutes = require('./routes/intelligence');
const jobRoutes = require('./routes/jobs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'active', node: 'LifeBoat_Alpha_1' });
});

app.listen(PORT, () => {
    console.log(`[LifeBoat_Backend] Strategic Uplink Active on port ${PORT}`);
});
