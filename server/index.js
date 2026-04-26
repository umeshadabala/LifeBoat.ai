const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const intelligenceRoutes = require('./routes/intelligence');
const jobRoutes = require('./routes/jobs');
const housingRoutes = require('./routes/housing');
const discoveryRoutes = require('./routes/discovery');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/housing', housingRoutes);
app.use('/api/discovery', discoveryRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'active', node: 'LifeBoat_Alpha_1' });
});

app.listen(PORT, () => {
    console.log(`[LifeBoat_Backend] Strategic Uplink Active on port ${PORT}`);
});
