const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/parse', async (req, res) => {
    const { text } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(401).json({ error: "GEMINI_API_KEY Missing in backend uplink." });
    }

    if (!text) {
        return res.status(400).json({ error: "No neural input detected." });
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      Analyze this resume text and return a valid JSON object in this PRICISE format:
      {
        "skills": [{"name": "SkillName", "level": 0-100, "strength": "Elite/Advanced/Steady"}],
        "resilience": 0-100,
        "strengthLabel": "ELITE/TACTICAL/OPTIMAL"
      }
      Extract the top 8 technical skills. Calculate resilience based on experience depth.
      Text: "${text.substring(0, 5000)}"
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text().replace(/```json|```/g, "").trim();

        res.json(JSON.parse(jsonString));
    } catch (error) {
        console.error("Neural extraction failure:", error);
        res.status(500).json({ error: "Agent extraction failed. Falling back to local heuristics." });
    }
});

module.exports = router;
