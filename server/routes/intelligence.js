import express from 'express';
import axios from 'axios';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── PDF Text Extraction (pdf-parse v2 API) ────────────────────────────
async function extractPdfText(buffer) {
    const parser = new PDFParse({
        verbosity: 0,
        data: new Uint8Array(buffer)
    });
    await parser.load();
    const result = await parser.getText();
    parser.destroy();
    return result.text || '';
}

const FREE_MODELS = [
    'deepseek/deepseek-v4-flash:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'google/gemma-4-31b-it:free',
    'google/gemma-4-26b-a4b-it:free',
    'qwen/qwen3-coder:free',
    'openai/gpt-oss-20b:free',
];

// ─── Resume Parse Endpoint ─────────────────────────────────────────────
router.post('/parse', upload.single('resume'), async (req, res) => {
    let text = req.body.text || '';
    let userName = req.body.name || '';

    // Accept user-provided API key, fall back to server env
    const userApiKey = req.body.apiKey || '';
    const API_KEY = userApiKey || process.env.OPENROUTER_API_KEY;
    const useUserModel = userApiKey && req.body.model;
    const modelsToTry = useUserModel ? [req.body.model] : FREE_MODELS;

    // Extract text from uploaded file
    if (req.file) {
        const isPdf = req.file.mimetype === 'application/pdf' ||
            (req.file.originalname && req.file.originalname.toLowerCase().endsWith('.pdf'));

        if (isPdf) {
            try {
                text = await extractPdfText(req.file.buffer);
                if (!text || text.trim().length < 20) {
                    return res.status(400).json({
                        error: "PDF appears to be empty or image-based. Please use a text-based PDF."
                    });
                }
            } catch (err) {
                console.error("PDF parse error:", err.message);
                return res.status(400).json({
                    error: "Could not read this PDF. Try re-saving it from Word/Google Docs as a new PDF.",
                    detail: err.message
                });
            }
        } else {
            text = req.file.buffer.toString('utf8');
        }
    }

    if (!text || text.trim().length < 30) {
        return res.status(400).json({ error: "Resume content too short or empty." });
    }

    if (!API_KEY) {
        return res.status(401).json({ error: "No API key available. Please provide your OpenRouter API key." });
    }

    try {
        const prompt = `You are an expert resume/CV analyst. Carefully analyze the provided resume text and extract ALL information thoroughly.

Return ONLY valid JSON (no markdown, no explanation, no code block) in EXACTLY this structure:
{
  "name": "${userName || 'Extract from resume'}",
  "primary_role": "Most recent or target job title",
  "career_summary": "2-3 sentence professional summary of the candidate",
  "years_of_experience": "e.g. 5 years",
  "seniority_level": "Entry | Junior | Mid | Senior | Lead | Principal | Director",
  "technical_skills": [
    {"name": "React", "level": 90, "strength": "Elite"},
    {"name": "Node.js", "level": 80, "strength": "Strong"}
  ],
  "soft_skills": ["Leadership", "Communication"],
  "industry_expertise": ["Fintech", "SaaS"],
  "previous_titles": [
    {"title": "Senior Engineer", "company": "Acme Corp", "duration": "2021-2024"}
  ],
  "education": ["B.Tech in CS, IIT Bombay, 2018"],
  "certifications": ["AWS Solutions Architect"],
  "preferred_locations": ["Bangalore", "Remote"],
  "key_strengths": ["System Design", "Microservices"],
  "target_roles": ["Senior Backend Engineer"],
  "skills": ["React", "Node.js", "Python", "AWS"],
  "resilience": 85
}

Important:
- Extract the candidate's REAL name from the resume if not provided
- "skills" must be a flat array of ALL technical skill names for job matching
- "level" should be 60-98 based on depth/frequency of mention
- "strength" is: "Elite" | "Strong" | "Developing"
- No emojis. Be thorough.

Resume Text:
${text.substring(0, 6000)}`;

        let lastError = null;

        for (const model of modelsToTry) {
            try {
                console.log(`[Intelligence] Trying model: ${model}`);
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.2,
                    max_tokens: 1000
                }, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://lifeboatai.app',
                        'X-Title': 'LifeBoat.ai'
                    },
                    timeout: 45000
                });

                if (response.data?.error) {
                    throw new Error(response.data.error.message || "OpenRouter inline error");
                }

                const choices = response.data?.choices;
                if (!choices || choices.length === 0) {
                    throw new Error("No choices returned from OpenRouter");
                }

                const content = choices[0]?.message?.content;
                if (!content) {
                    throw new Error("Empty or null content returned from OpenRouter");
                }

                const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
                const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No JSON in AI response");

                const parsed = JSON.parse(jsonMatch[0]);

                if (userName && userName.trim()) parsed.name = userName.trim();

                if (!parsed.skills || parsed.skills.length === 0) {
                    parsed.skills = (parsed.technical_skills || []).map(s => typeof s === 'string' ? s : (s.name || s));
                }

                console.log(`[Intelligence] Success with model: ${model}`);
                return res.json({ ...parsed, extractedText: text.substring(0, 5000) });

            } catch (err) {
                const code = err.response?.status || err.response?.data?.error?.code || err.status;
                console.warn(`[Intelligence] Model ${model} failed (${code}): ${err.response?.data?.error?.message || err.message}`);
                lastError = err;
                // Only break the fallback chain if it's an authorization/authentication issue (401)
                if (code === 401) {
                    console.error(`[Intelligence] Authorization failed, aborting fallbacks.`);
                    break;
                }
            }
        }

        console.error("Intelligence parse error: all models failed.", lastError?.response?.data || lastError?.message);
        const detail = lastError?.response?.data?.error?.message || lastError?.message;
        res.status(500).json({ error: "AI analysis failed. All models are currently rate-limited. Please try again in a minute or provide your own API key.", detail });

    } catch (error) {
        console.error("Intelligence unexpected error:", error.message);
        res.status(500).json({ error: "AI analysis failed.", detail: error.message });
    }
});

export default router;
