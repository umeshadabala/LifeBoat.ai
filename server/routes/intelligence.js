const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/parse', async (req, res) => {
    const { text } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

    if (!API_KEY) {
        return res.status(401).json({ error: "OPENROUTER_API_KEY Missing in backend uplink." });
    }

    if (!text) {
        return res.status(400).json({ error: "No neural input detected." });
    }

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a specialized career intelligence agent. Return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `Analyze this resume text and return a valid JSON object in this PRECISE format:
          {
            "skills": [{"name": "SkillName", "level": 0-100, "strength": "Elite/Advanced/Steady"}],
            "resilience": 0-100,
            "strengthLabel": "ELITE/TACTICAL/OPTIMAL"
          }
          Extract the top 8 technical skills. Calculate resilience based on experience depth and complexity.
          Text: "${text.substring(0, 4000)}"`
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000', // Update this for production
                'X-Title': 'LifeBoat.ai',
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        const jsonString = content.replace(/```json|```/g, "").trim();

        res.json(JSON.parse(jsonString));
    } catch (error) {
        console.error("OpenRouter link failure:", error.response?.data || error.message);
        res.status(500).json({ error: "OpenRouter agent failed. Verify keys and model availability." });
    }
});

module.exports = router;
