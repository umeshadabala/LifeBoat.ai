/**
 * Truly Generic Intelligence Engine
 * Extracts skills based on linguistic patterns and frequency.
 * SANITIZED: Excludes PDF metadata and common non-skill capitalized words.
 */

export const extractIntelligence = (text = "") => {
    if (!text || text.length < 30) return { skills: [], resilience: 0, strengthLabel: 'NULL' };

    // 1. Identify "Candidate Skills" using Regex (Capitalized words or common tech patterns like Node.js)
    const skillPattern = /\b([A-Z][a-zA-Z0-9\+#\.]+(?:\.[a-z]+)?)\b/g;
    const matches = text.match(skillPattern) || [];

    // 2. Strict Blacklist for PDF metadata and common filler
    const blacklist = [
        'Length', 'Filter', 'FlateDecode', 'Type', 'Stream', 'Obj', 'Endobj', 'Startxref', 'EOF',
        'ExtGState', 'Font', 'ProcSet', 'XObject', 'MediaBox', 'Contents', 'Metadata', 'Parent',
        'Resources', 'Annots', 'BBox', 'Matrix', 'Subtype', 'Width', 'Height', 'The', 'And',
        'For', 'With', 'From', 'This', 'That', 'Work', 'Job', 'Experience', 'University',
        'Education', 'May', 'June', 'July', 'August', 'Project', 'Skills', 'Email', 'Phone',
        'Address', 'Profile', 'Abstract', 'References', 'Conclusion', 'Introduction', 'Total',
        'Page', 'Table', 'Figure', 'Section', 'Chapter', 'Volume'
    ];

    // 3. Filter matches: Must be capitalized, not in blacklist, and looks like a "Node"
    const potentialSkills = matches.filter(m => {
        return !blacklist.includes(m) &&
            m.length > 2 &&
            m.length < 20 &&
            /^[A-Z]/.test(m) &&
            !/^[0-9]/.test(m);
    });

    // 4. Calculate Frequency
    const freqMap = {};
    potentialSkills.forEach(s => {
        freqMap[s] = (freqMap[s] || 0) + 1;
    });

    // 5. Sort and Take Top 8
    const extracted = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, freq]) => {
            const hasSenior = text.toLowerCase().includes('senior') || text.toLowerCase().includes('lead');
            let level = 40 + (freq * 10);
            if (hasSenior) level += 15;
            const finalLevel = Math.min(level, 98);

            let strength = 'Professional';
            if (finalLevel > 90) strength = 'Elite';
            else if (finalLevel > 75) strength = 'Advanced';
            else if (finalLevel > 50) strength = 'Steady';

            return { name, level: finalLevel, strength };
        });

    // 6. Global Resilience
    const resilience = Math.min(50 + (extracted.length * 6), 100);

    return {
        skills: extracted,
        resilience,
        strengthLabel: resilience > 85 ? 'HIGH' : 'OPTIMAL'
    };
};
