const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/discovery', async (req, res) => {
    const { query, region } = req.query;
    const APP_ID = process.env.VITE_ADZUNA_APP_ID;
    const API_KEY = process.env.VITE_ADZUNA_API_KEY;

    try {
        // If keys are present, do real scraping, otherwise return a tactical fallback
        if (APP_ID && API_KEY) {
            const adzunaRegion = (region || 'gb').toLowerCase().substring(0, 2);
            const url = `https://api.adzuna.com/v1/api/jobs/${adzunaRegion}/search/1?app_id=${APP_ID}&app_key=${API_KEY}&what=${query || 'Software Engineer'}&results_per_page=30&content-type=application/json`;

            const response = await axios.get(url);
            const results = response.data.results.map(j => ({
                id: j.id,
                title: j.title,
                company: j.company.display_name,
                location: j.location.display_name,
                match: 85 + Math.floor(Math.random() * 15),
                salary: j.salary_min ? `£${Math.floor(j.salary_min / 1000)}k+` : "Competitive",
                tags: [j.category.label, "Live"],
                url: j.redirect_url,
                source: "ADZUNA_BACKEND"
            }));
            return res.json(results);
        }

        // Minimal fallback response (Simulating backend-driven static load)
        res.json([{ title: "Uplink Primary", company: "LifeBoat_Cache", location: "Global", source: "LOCAL_CACHE", match: 100, url: "#" }]);
    } catch (error) {
        res.status(500).json({ error: "Discovery feed failed." });
    }
});

module.exports = router;
