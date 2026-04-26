/**
 * LifeBoat.ai Neural Extraction Engine
 * Provides context-aware intelligence mapping from raw text.
 */

export const extractIntelligence = (text = "") => {
    if (!text || text.length < 50) {
        return {
            skills: [],
            resilience: 0,
            strengthLabel: "NULL",
            credits: 0
        };
    }

    const normalized = text.toLowerCase();

    const skillDictionary = [
        { name: 'React.js', keys: ['react', 'nextjs', 'remix', 'hook', 'state management'] },
        { name: 'Node.js', keys: ['node', 'express', 'nestjs', 'backend', 'api'] },
        { name: 'TypeScript', keys: ['typescript', 'ts', 'type-safe'] },
        { name: 'Python', keys: ['python', 'pytorch', 'django', 'fastapi', 'flask'] },
        { name: 'DevOps', keys: ['docker', 'kubernetes', 'aws', 'terraform', 'ci/cd', 'github actions'] },
        { name: 'System Design', keys: ['architecture', 'microservices', 'scalability', 'distributed systems'] },
        { name: 'UI/UX', keys: ['figma', 'design system', 'tailwind', 'css', 'framer motion'] }
    ];

    // 1. Calculate Raw Frequency & Density
    const rawScores = skillDictionary.map(skill => {
        const frequency = skill.keys.reduce((acc, key) => acc + (normalized.split(key).length - 1), 0);
        return { name: skill.name, frequency };
    });

    // 2. Identify Experience Level Markers
    const hasSenior = /senior|staff|principal|lead|head|architect/.test(normalized);
    const yearsMatch = normalized.match(/(\d+)\+?\s*years/);
    const years = yearsMatch ? parseInt(yearsMatch[1]) : 1;

    // 3. Project Intensity Markers (Action Verbs)
    const intensifiers = (normalized.match(/built|implemented|scaled|designed|led|optimized|pioneered/g) || []).length;

    // 4. Compute Dynamic Levels
    const finalizedSkills = rawScores.map(score => {
        if (score.frequency === 0) return null;

        // Base score from frequency
        let level = 30 + (score.frequency * 8);

        // Boost based on seniority & years
        if (hasSenior) level += 15;
        level += (years * 2);

        // Boost based on action verbs
        level += (intensifiers * 1.5);

        // Synergy boost (e.g. TS + React)
        const hasTS = normalized.includes('typescript') || normalized.includes(' ts ');
        if (score.name === 'React.js' && hasTS) level += 10;

        const finalLevel = Math.min(Math.round(level), 99);

        let strength = 'Intro';
        if (finalLevel > 90) strength = 'Elite';
        else if (finalLevel > 75) strength = 'Advanced';
        else if (finalLevel > 55) strength = 'Professional';
        else if (finalLevel > 40) strength = 'Intermediate';

        return { name: score.name, level: finalLevel, strength };
    }).filter(Boolean);

    // 5. Global Metrics
    const resilience = Math.min(Math.round(40 + (finalizedSkills.length * 8) + (years * 2)), 100);
    const credits = Math.floor(text.length / 40) + (finalizedSkills.length * 10);

    return {
        skills: finalizedSkills,
        resilience,
        strengthLabel: resilience > 85 ? 'ELITE' : resilience > 70 ? 'TACTICAL' : 'OPTIMAL',
        credits
    };
};
