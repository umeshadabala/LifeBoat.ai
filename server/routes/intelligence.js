const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/parse', async (req, res) => {
    const { text } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

    if (!API_KEY) {
        return res.status(401).json({ error: "OPENROUTER_API_KEY Missing." });
    }

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an Elite Career Intelligence Analyst. Your task is to extract high-leverage technical skills from resume text. DO NOT include generic words or PDF metadata. Return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `Perform a deep semantic audit of this resume. Extract the top 8 actual technical skills (languages, frameworks, tools). 
          Determine skill level (0-100) based on frequency and complexity of projects mentioned.
          Identify seniority (Elite/Advanced/Steady).
          Calculate a total Career Resilience score (0-100).
          
          Return in this JSON format:
          {
            "skills": [{"name": "Skill", "level": 85, "strength": "Elite"}],
            "resilience": 88,
            "strengthLabel": "ELITE"
          }
          
          Text: "${text.substring(0, 4000)}"`
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'LifeBoat.ai',
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        const jsonString = content.replace(/```json|```/g, "").trim();
        res.json(JSON.parse(jsonString));
    } catch (error) {
        console.error("Intelligence failure:", error.message);
        res.status(500).json({ error: "Intelligence Uplink Failure." });
    }
});

module.exports = router;
