import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/scrape', async (req, res) => {
    const { query, location } = req.query;
    const API_KEY = process.env.VITE_SERPER_API_KEY;

    if (!API_KEY) {
        return res.status(401).json({ error: "SERPER_API_KEY Missing in backend uplink." });
    }

    try {
        const response = await axios.post('https://google.serper.dev/search', {
            q: `${query || 'Software Engineer jobs'} in ${location || 'Bangalore'}`,
            num: 15
        }, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Transform Serper organic results into Listing Nodes
        const nodes = response.data.organic.map((item, index) => ({
            id: 9000 + index,
            title: item.title.substring(0, 40),
            company: "Live Node",
            location: location || "Global",
            match: 90 + Math.floor(Math.random() * 9),
            salary: "Extracted",
            tags: ["Real-time", "Verified"],
            url: item.link,
            source: "SERPER_LIVE"
        }));

        res.json(nodes);
    } catch (error) {
        console.error("Serper uplink failure:", error.message);
        res.status(500).json({ error: "Wide-web scraping failed." });
    }
});

export default router;
