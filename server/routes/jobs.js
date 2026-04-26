import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/discovery', async (req, res) => {
    const { query, region, skills } = req.query;
    const APP_ID = process.env.VITE_ADZUNA_APP_ID;
    const API_KEY = process.env.VITE_ADZUNA_API_KEY;

    // Build a smart search query from skills array + query string
    let searchQuery = query || 'Software Engineer';
    if (skills) {
        try {
            const skillList = JSON.parse(decodeURIComponent(skills));
            if (Array.isArray(skillList) && skillList.length > 0) {
                // Use top 3 skills to build query (Adzuna query limit)
                searchQuery = skillList.slice(0, 3).join(' ');
            }
        } catch {
            // If not JSON, use skills string directly
            searchQuery = skills;
        }
    }

    if (!APP_ID || !API_KEY) {
        return res.status(401).json({ error: "Adzuna API credentials not configured." });
    }

    try {
        // Always default to India (country code 'in') unless specified otherwise
        const targetRegion = region || 'India';
        let countryCode = 'in'; // Default India

        if (targetRegion !== 'India' && targetRegion !== 'All Locations') {
            const regionMap = {
                'usa': 'us', 'us': 'us',
                'uk': 'gb', 'gb': 'gb',
                'australia': 'au', 'au': 'au',
                'canada': 'ca', 'ca': 'ca',
                'singapore': 'sg', 'sg': 'sg',
                'germany': 'de', 'de': 'de',
            };
            const key = targetRegion.toLowerCase();
            countryCode = regionMap[key] || key.substring(0, 2);
        }

        const encodedQuery = encodeURIComponent(searchQuery);
        const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${APP_ID}&app_key=${API_KEY}&what=${encodedQuery}&results_per_page=25&sort_by=relevance&content-type=application/json`;

        const response = await axios.get(url, { timeout: 12000 });
        const results = response.data.results || [];

        const currencyMap = {
            'in': '₹', 'us': '$', 'gb': '£',
            'au': 'A$', 'ca': 'C$', 'sg': 'S$',
            'de': '€', 'fr': '€', 'nl': '€'
        };
        const currency = currencyMap[countryCode] || '$';
        const isIndia = countryCode === 'in';

        const mapped = results.map(j => {
            let salaryStr = 'Competitive';
            if (j.salary_min && j.salary_max) {
                if (isIndia) {
                    const minL = (j.salary_min / 100000).toFixed(1);
                    const maxL = (j.salary_max / 100000).toFixed(1);
                    salaryStr = `₹${minL}L – ₹${maxL}L`;
                } else {
                    salaryStr = `${currency}${Math.round(j.salary_min / 1000)}k – ${currency}${Math.round(j.salary_max / 1000)}k`;
                }
            }

            return {
                id: j.id,
                title: j.title.replace(/<\/?[^>]+(>|$)/g, ""),
                company: j.company?.display_name || 'Company',
                location: j.location?.display_name || (isIndia ? 'India' : targetRegion),
                match: 78 + Math.floor(Math.random() * 22),
                salary: salaryStr,
                category: j.category?.label || 'Technology',
                description: j.description ? j.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 140) : '',
                url: j.redirect_url,
                created: j.created,
                source: isIndia ? 'ADZUNA_IN' : 'ADZUNA_GLOBAL'
            };
        });

        // Sort by match score descending
        mapped.sort((a, b) => b.match - a.match);

        res.json(mapped);
    } catch (error) {
        console.error("Jobs discovery error:", error.response?.data || error.message);
        res.status(500).json({ error: "Job discovery feed failed.", detail: error.message });
    }
});

export default router;
