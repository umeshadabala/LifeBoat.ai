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

// ─── Resume Parse Endpoint ─────────────────────────────────────────────
router.post('/parse', upload.single('resume'), async (req, res) => {
    let text = req.body.text || '';
    let userName = req.body.name || '';

    const API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-3-27b-it:free';

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
        return res.status(401).json({ error: "OPENROUTER_API_KEY not configured." });
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

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODEL,
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

        const content = response.data.choices[0].message.content;
        const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON in AI response");

        const parsed = JSON.parse(jsonMatch[0]);

        if (userName && userName.trim()) parsed.name = userName.trim();

        if (!parsed.skills || parsed.skills.length === 0) {
            parsed.skills = (parsed.technical_skills || []).map(s => typeof s === 'string' ? s : (s.name || s));
        }

        res.json({ ...parsed, extractedText: text.substring(0, 5000) });

    } catch (error) {
        console.error("Intelligence parse error:", error.response?.data || error.message);
        res.status(500).json({ error: "AI analysis failed.", detail: error.message });
    }
});

// ─── ATS Resume Builder Endpoint ───────────────────────────────────────
router.post('/resume-builder', async (req, res) => {
    const { resumeText, candidateProfile, jobTitle, jobCompany, jobDescription, jobUrl } = req.body;

    const API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-3-27b-it:free';
    const SERPER_API_KEY = process.env.SERPER_API_KEY;

    if (!API_KEY) {
        return res.status(401).json({ error: "OPENROUTER_API_KEY not configured." });
    }

    let enrichedJobDescription = jobDescription || 'Not available';

    // Enhance Job Description using Serper if API Key is available
    if (SERPER_API_KEY && SERPER_API_KEY.trim().length > 10) {
        try {
            console.log(`[Resume Builder] Enriching JD for ${jobTitle} at ${jobCompany} using Serper...`);
            const serperData = JSON.stringify({
                q: `${jobTitle} ${jobCompany} job description requirements responsibilities`,
                num: 4
            });

            const serperConfig = {
                method: 'post',
                url: 'https://google.serper.dev/search',
                headers: { 
                    'X-API-KEY': SERPER_API_KEY, 
                    'Content-Type': 'application/json'
                },
                data: serperData
            };

            const serperResponse = await axios(serperConfig);
            
            if (serperResponse.data && serperResponse.data.organic) {
                const snippets = serperResponse.data.organic
                    .map(r => r.snippet || '')
                    .filter(s => s.length > 20)
                    .join(' ');
                
                if (snippets.length > 100) {
                    enrichedJobDescription = `[Original Adzuna Snippet]: ${jobDescription}\n[Enriched Search Snippets]: ${snippets}`;
                }
            }
        } catch (serperErr) {
            console.error("Serper API error (falling back to original JD):", serperErr.message);
        }
    }

    const candidateName = candidateProfile?.name || 'Candidate';
    const candidateSkills = candidateProfile?.skills?.join(', ') || '';
    const candidateExp = candidateProfile?.years_of_experience || '';
    const candidateEducation = (candidateProfile?.education || []).join('; ');
    const previousRoles = (candidateProfile?.previous_titles || [])
        .map(r => `${r.title} at ${r.company} (${r.duration || ''})`)
        .join('; ');
    const certifications = (candidateProfile?.certifications || []).join(', ');

    const prompt = `You are an expert ATS (Applicant Tracking System) resume writer. Create a perfectly optimized, ATS-friendly resume for this candidate tailored to the specific job below.

TARGET JOB:
- Title: ${jobTitle || 'Software Engineer'}
- Company: ${jobCompany || 'Company'}
- Description: ${enrichedJobDescription}

CANDIDATE DATA:
- Name: ${candidateName}
- Skills: ${candidateSkills}
- Experience: ${candidateExp}
- Education: ${candidateEducation}
- Previous Roles: ${previousRoles}
- Certifications: ${certifications}

ORIGINAL RESUME TEXT (for additional context):
${(resumeText || '').substring(0, 3000)}

INSTRUCTIONS:
1. Structure the resume with clear ATS-friendly sections: Contact Info, Professional Summary, Technical Skills, Work Experience, Education, Certifications
2. Write the Professional Summary tailored to the target job
3. Under each work experience, write 3-5 bullet points using STAR method (Situation, Task, Action, Result)
4. Naturally incorporate keywords from the job description into the resume
5. Use clean formatting: no tables, no graphics, no columns
6. Quantify achievements where possible (e.g., "Reduced load time by 40%")
7. Keep it to 1-2 pages worth of content

Return the resume as clean, formatted plain text. Use these section markers:
===HEADER===
===SUMMARY===
===SKILLS===
===EXPERIENCE===
===EDUCATION===
===CERTIFICATIONS===

Do NOT use markdown. Use plain text only.`;

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://lifeboatai.app',
                'X-Title': 'LifeBoat.ai Resume Builder'
            },
            timeout: 60000
        });

        const resumeContent = response.data.choices[0].message.content;

        // Build a clean HTML document for the resume
        const htmlResume = buildResumeHTML(resumeContent, candidateName, jobTitle, jobCompany);

        res.json({
            resumeText: resumeContent,
            resumeHTML: htmlResume,
            targetJob: { title: jobTitle, company: jobCompany }
        });

    } catch (error) {
        console.error("Resume builder error:", error.response?.data || error.message);
        res.status(500).json({ error: "Resume generation failed.", detail: error.message });
    }
});

function buildResumeHTML(content, candidateName, jobTitle, company) {
    // Clean and format the plain text into presentation-ready HTML
    const escaped = content
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/===HEADER===/g, '<div class="resume-section resume-header">')
        .replace(/===SUMMARY===/g, '</div><div class="resume-section"><h2>Professional Summary</h2>')
        .replace(/===SKILLS===/g, '</div><div class="resume-section"><h2>Technical Skills</h2>')
        .replace(/===EXPERIENCE===/g, '</div><div class="resume-section"><h2>Work Experience</h2>')
        .replace(/===EDUCATION===/g, '</div><div class="resume-section"><h2>Education</h2>')
        .replace(/===CERTIFICATIONS===/g, '</div><div class="resume-section"><h2>Certifications</h2>')
        .replace(/\n/g, '<br>');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${candidateName} — Resume for ${jobTitle} at ${company}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    color: #1a1a2e;
    background: #fff;
    line-height: 1.65;
    font-size: 14px;
    padding: 48px;
    max-width: 850px;
    margin: 0 auto;
}
.resume-header {
    text-align: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid #2563eb;
}
.resume-header h1, .resume-header strong {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
}
.resume-section {
    margin-bottom: 24px;
}
.resume-section h2 {
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #2563eb;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 12px;
}
.no-print {
    position: fixed;
    top: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
    z-index: 100;
}
.no-print button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
}
.btn-print {
    background: #2563eb;
    color: white;
}
.btn-gdocs {
    background: #16a34a;
    color: white;
}
.btn-copy {
    background: #1e293b;
    color: white;
}
@media print {
    .no-print { display: none; }
    body { padding: 24px; font-size: 12px; }
}
</style>
</head>
<body>

<div class="no-print">
    <button class="btn-copy" onclick="copyToClipboard()">Copy Text</button>
    <button class="btn-gdocs" onclick="openInGDocs()">Open in Google Docs</button>
    <button class="btn-print" onclick="window.print()">Save as PDF</button>
</div>

${escaped}
</div>

<script>
function copyToClipboard() {
    const text = document.body.innerText.replace('Copy Text', '').replace('Open in Google Docs', '').replace('Save as PDF', '').trim();
    navigator.clipboard.writeText(text).then(() => {
        alert('Resume text copied to clipboard! Paste it into Google Docs.');
    });
}
function openInGDocs() {
    const text = document.body.innerText.replace('Copy Text', '').replace('Open in Google Docs', '').replace('Save as PDF', '').trim();
    const encoded = encodeURIComponent(text);
    // Google Docs blank doc + auto-paste instruction
    const gdocsUrl = 'https://docs.google.com/document/create';
    const newWindow = window.open(gdocsUrl, '_blank');
    // Copy to clipboard so user can paste
    navigator.clipboard.writeText(text).then(() => {
        setTimeout(() => {
            alert('Google Docs opened! Press Ctrl+V (or Cmd+V) to paste your resume.');
        }, 1500);
    });
}
</script>
</body>
</html>`;
}

// ─── Serve generated resume as HTML page ───────────────────────────────
let latestResumes = {};

router.post('/resume-serve', (req, res) => {
    const { html, id } = req.body;
    if (html && id) {
        latestResumes[id] = html;
        // Auto-cleanup after 30 minutes
        setTimeout(() => delete latestResumes[id], 30 * 60 * 1000);
        res.json({ url: `/api/intelligence/resume-view/${id}` });
    } else {
        res.status(400).json({ error: "Missing html or id" });
    }
});

router.get('/resume-view/:id', (req, res) => {
    const html = latestResumes[req.params.id];
    if (html) {
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } else {
        res.status(404).send('<h1>Resume expired or not found.</h1>');
    }
});

export default router;
