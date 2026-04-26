const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/parse', async (req, res) => {
    const { text } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const SERPER_KEY = process.env.VITE_SERPER_API_KEY;
    const MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

    if (!API_KEY) {
        return res.status(401).json({ error: "INTELLIGENCE_UPLINK_OFFLINE" });
    }

    try {
        // 1. Semantic Extraction
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a Professional Career Auditor. Extract high-leverage technical data. Return ONLY JSON. NO EMOJIS."
                },
                {
                    role: "user",
                    content: `Extract the following from this resume:
          1. Candidate Name (Full Name)
          2. Top 8 Technical Skills
          3. Resilience Score (0-100)
          
          Return in this JSON format:
          {
            "name": "Full Name",
            "skills": [{"name": "Skill", "level": 90, "strength": "Elite"}],
            "resilience": 85
          }
          Text: "${text.substring(0, 4000)}"`
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const parsed = JSON.parse(response.data.choices[0].message.content.replace(/```json|```/g, "").trim());

        // 2. Serper Market Validation (Optional but highly recommended)
        if (SERPER_KEY && parsed.skills.length > 0) {
            try {
                const topSkill = parsed.skills[0].name;
                const marketResponse = await axios.post('https://google.serper.dev/search', {
                    q: `average salary and demand for ${topSkill} developer 2026`,
                    num: 1
                }, {
                    headers: { 'X-API-KEY': SERPER_KEY }
                });

                const marketSnippet = marketResponse.data.organic[0]?.snippet || "High market demand detected.";
                parsed.marketContext = marketSnippet;
            } catch (e) {
                console.warn("Market validation skipped.");
            }
        }

        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: "INTELLIGENCE_FAILURE" });
    }
});

module.exports = router;
