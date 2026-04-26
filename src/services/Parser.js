/**
 * Definitively Stable Intelligence Engine
 * Only allows high-confidence technical nodes.
 */

export const extractIntelligence = (text = "") => {
    if (!text || text.length < 50) return { skills: [], resilience: 0, strengthLabel: 'OFFLINE' };

    // 1. Strictly define technical markers
    const techWhitelis = [
        'React', 'Node', 'Python', 'Java', 'SQL', 'Docker', 'AWS', 'Kubernetes', 'TypeScript',
        'Javascript', 'Reactjs', 'Nextjs', 'Tailwind', 'Express', 'MongoDB', 'PostgreSQL',
        'Redux', 'GraphQL', 'Framer', 'Terraform', 'Azure', 'GCP', 'DevOps', 'Rust', 'Go'
    ];

    // 2. Identify tokens
    const tokens = text.match(/\b([A-Za-z\+#\.]{2,})\b/g) || [];

    // 3. Filter against known tech or strong professional patterns
    const skills = [];
    const seen = new Set();

    tokens.forEach(token => {
        const lower = token.toLowerCase();
        const matched = techWhitelis.find(t => t.toLowerCase() === lower);

        if (matched && !seen.has(matched)) {
            const freq = (text.match(new RegExp(`\\b${token}\\b`, 'gi')) || []).length;
            skills.push({
                name: matched,
                level: Math.min(60 + (freq * 10), 98),
                strength: freq > 2 ? 'Elite' : 'Steady'
            });
            seen.add(matched);
        }
    });

    // 4. Return sorted skills (top 8)
    const finalSkills = skills.sort((a, b) => b.level - a.level).slice(0, 8);
    const resilience = Math.min(40 + (finalSkills.length * 10), 99);

    return {
        skills: finalSkills,
        resilience,
        strengthLabel: resilience > 80 ? 'OPTIMAL' : 'STRATEGIC'
    };
};
