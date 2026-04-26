const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/discovery', async (req, res) => {
    const { city, region, budget } = req.query;
    const SERPER_KEY = process.env.VITE_SERPER_API_KEY;

    try {
        let results = [];

        if (SERPER_KEY && city) {
            const query = `affordable PG room dorm near ${city} under ${budget || 'any price'}`;
            const response = await axios.post('https://google.serper.dev/search', {
                q: query,
                num: 10
            }, {
                headers: { 'X-API-KEY': SERPER_KEY }
            });

            results = response.data.organic.map((item, index) => ({
                id: 7000 + index,
                name: item.title.split('|')[0].trim(),
                location: city,
                price: "Check Link", // Dynamic price extraction from snippet is complex, we provide link
                rating: "4.5",
                url: item.link,
                source: "SERPER_REAL_TIME"
            }));
        }

        // Fallback if no Serper key or failed
        if (results.length === 0) {
            const isIndia = region === 'India' || city === 'Bangalore';
            const currency = isIndia ? '₹' : '$';
            const base = isIndia ? 8000 : 600;

            results = Array.from({ length: 12 }).map((_, i) => ({
                id: 8000 + i,
                name: `Strategic Haven ${i + 1}`,
                location: city || "Global Hub",
                price: `${currency}${base + (i * 1000)}/mo`,
                rating: "4.7",
                url: "https://www.google.com/maps/search/PG+near+me",
                source: "REGIONAL_FALLBACK"
            }));
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "HOUSING_DISCOVERY_OFFLINE" });
    }
});

module.exports = router;
