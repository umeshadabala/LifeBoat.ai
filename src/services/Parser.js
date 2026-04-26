/**
 * Truly Generic Intelligence Engine - EXTREME SANITIZATION v2
 * Extracts skills based on linguistic patterns and frequency.
 * Designed to OBLITERATE PDF metadata junk.
 */

export const extractIntelligence = (text = "") => {
    if (!text || text.length < 30) return { skills: [], resilience: 0, strengthLabel: 'NULL' };

    // 1. OBLITERATE PDF METADATA BLOCKS (Orbital Strike)
    const sanitizedText = text
        .replace(/\/([a-zA-Z0-9]+)/g, ' ')               // Remove /Type, /Filter, etc.
        .replace(/<<[\s\S]*?>>/g, ' ')                   // Remove PDF dictionaries
        .replace(/\[\d+\s+\d+\s+R\]/g, ' ')              // Remove PDF references
        .replace(/\b[0-9a-fA-F]{32,}\b/g, ' ')           // Remove long hex strings
        .replace(/\b[0-9]+\s+[0-9]+\s+obj\b/gi, ' ')     // Remove object markers
        .replace(/endobj|stream|endstream|xref/gi, ' '); // Remove stream markers

    // 2. Identify "Candidate Skills" with high selectivity
    const skillPattern = /\b([A-Z][a-zA-Z0-9\+#\.]+(?:\.[a-z]+)?)\b/g;
    const rawMatches = sanitizedText.match(skillPattern) || [];

    // 3. Maximum-Security Blacklist (Includes user-reported 404/junk keys)
    const blacklist = [
        'Length', 'Length1', 'Length2', 'Length3', 'Filter', 'FlateDecode', 'Type', 'Stream',
        'Obj', 'Endobj', 'Startxref', 'EOF', 'DecodeParms', 'Columns', 'Predictor', 'Size',
        'XRef', 'Index', 'Prev', 'Root', 'Info', 'ID', 'Encrypt', 'BitsPerComponent',
        'Colors', 'ExtGState', 'Font', 'ProcSet', 'XObject', 'ColorSpace', 'MediaBox',
        'Contents', 'Metadata', 'Parent', 'Resources', 'Annots', 'BBox', 'Matrix',
        'Subtype', 'Width', 'Height', 'The', 'And', 'For', 'With', 'From', 'This',
        'That', 'Experience', 'University', 'Education', 'Profile', 'Abstract',
        'References', 'Conclusion', 'Introduction', 'Volume', 'Page', 'Table', 'Figure'
    ];

    // 4. Heuristic Skill Validation
    const potentialSkills = rawMatches.filter(m => {
        return !blacklist.includes(m) &&
            m.length > 2 &&
            m.length < 22 &&
            /^[A-Z]/.test(m) &&
            /[a-z]/.test(m) && // Must have at least one lowercase (Real tech: React, Node, SQL)
            !/^[0-9]/.test(m);
    });

    // 5. Calculate Frequency
    const freqMap = {};
    potentialSkills.forEach(s => {
        freqMap[s] = (freqMap[s] || 0) + 1;
    });

    // 6. Sort and Extract Top 8
    const extracted = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, freq]) => {
            const hasSenior = sanitizedText.toLowerCase().includes('senior') || sanitizedText.toLowerCase().includes('lead');
            let level = 40 + (freq * 10);
            if (hasSenior) level += 15;
            const finalLevel = Math.min(level, 98);

            let strength = 'Professional';
            if (finalLevel > 90) strength = 'Elite';
            else if (finalLevel > 75) strength = 'Advanced';
            else if (finalLevel > 50) strength = 'Steady';

            return { name, level: finalLevel, strength };
        });

    // 7. Dynamic Resilience
    const resilience = Math.min(50 + (extracted.length * 6), 100);

    return {
        skills: extracted,
        resilience,
        strengthLabel: resilience > 85 ? 'HIGH' : 'OPTIMAL'
    };
};
