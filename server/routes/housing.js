const express = require('express');
const router = express.Router();

router.get('/discovery', async (req, res) => {
    const { city, region } = req.query;

    // Real-world logic would use a housing API (Zillow, Roomies, etc.)
    // Here we use a location-aware dynamic generator for PGs, Dorms, and Rooms.
    const types = ['Executive PG', 'Student Dorm', 'Co-living Space', 'Private Room', 'Studio Apartment'];
    const hubs = ['Silicon Junction', 'Metro Central', 'Tech Park North', 'University Quarter'];

    const results = Array.from({ length: 12 }).map((_, i) => {
        const type = types[i % types.length];
        const hub = hubs[i % hubs.length];
        const basePrice = region === 'India' ? 12000 : 800;
        const currency = region === 'India' ? '₹' : '$';

        return {
            id: 5000 + i,
            name: `${type} in ${hub}`,
            location: `${city || 'Detected Hub'}, ${region || 'Global'}`,
            price: `${currency}${basePrice + (i * 1000)}/mo`,
            rating: (4.2 + (Math.random() * 0.8)).toFixed(1),
            tags: ['Verified', 'High-Speed WiFi', 'Secure'],
            url: region === 'India' ? 'https://www.magicbricks.com' : 'https://www.zillow.com'
        };
    });

    res.json(results);
});

module.exports = router;
