const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/discovery', async (req, res) => {
    const { query, region } = req.query;
    const APP_ID = process.env.VITE_ADZUNA_APP_ID;
    const API_KEY = process.env.VITE_ADZUNA_API_KEY;

    try {
        let results = [];

        // 1. REGIONAL ROUTING FOR INDIA (India specific feed stabilization)
        if (region === 'India' || region === 'in') {
            // Adzuna for India might need 'in' code or specific hub searches
            const countryCode = 'in';
            const hubs = ['Bangalore', 'Hyderabad', 'Pune', 'Gurgaon', 'Mumbai'];
            const searchHub = hubs[Math.floor(Math.random() * hubs.length)];

            const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${APP_ID}&app_key=${API_KEY}&what=${query || 'Software Engineer'}&where=${searchHub}&results_per_page=20&content-type=application/json`;
            const response = await axios.get(url);
            results = response.data.results.map(j => ({
                id: j.id,
                title: j.title,
                company: j.company.display_name,
                location: `${j.location.display_name}, India`,
                match: 85 + Math.floor(Math.random() * 15),
                salary: j.salary_min ? `₹${Math.floor(j.salary_min / 1000)}L+` : "Competitive",
                tags: [j.category.label, "India Hub"],
                url: j.redirect_url,
                source: "ADZUNA_INDIA"
            }));
        } else if (APP_ID && API_KEY) {
            // Global logic
            const countryCode = (region === 'All Locations' || !region) ? 'us' : region.toLowerCase().substring(0, 2);
            const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${APP_ID}&app_key=${API_KEY}&what=${query || 'Software Engineer'}&results_per_page=30&content-type=application/json`;
            const response = await axios.get(url);
            results = response.data.results.map(j => ({
                id: j.id,
                title: j.title,
                company: j.company.display_name,
                location: j.location.display_name,
                match: 80 + Math.floor(Math.random() * 20),
                salary: j.salary_min ? `$${Math.floor(j.salary_min / 1000)}k+` : "Competitive",
                tags: [j.category.label, "Live"],
                url: j.redirect_url,
                source: "ADZUNA_GLOBAL"
            }));
        }

        res.json(results);
    } catch (error) {
        console.error("Discovery error:", error.response?.data || error.message);
        res.status(500).json({ error: "Discovery feed unstable." });
    }
});

module.exports = router;
