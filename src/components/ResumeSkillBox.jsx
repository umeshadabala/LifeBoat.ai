import React, { useMemo } from 'react';
import { Target, BrainCircuit, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeSkillBox = ({ resumeText = "" }) => {
    // --- REAL-TIME PARSING ENGINE (DUMMY BUT DYNAMIC) ---
    const metrics = useMemo(() => {
        const text = resumeText.toLowerCase();
        const skillsList = [
            { name: 'React.js', keys: ['react', 'nextjs', 'remix'] },
            { name: 'Node.js', keys: ['node', 'express', 'nestjs'] },
            { name: 'TypeScript', keys: ['typescript', 'ts'] },
            { name: 'Python', keys: ['python', 'pytorch', 'django'] },
            { name: 'DevOps', keys: ['docker', 'kubernetes', 'aws', 'terraform'] },
            { name: 'System Design', keys: ['architecture', 'system design', 'scalability'] }
        ];

        const extracted = skillsList.map(skill => {
            const count = skill.keys.reduce((acc, key) => acc + (text.split(key).length - 1), 0);
            let level = Math.min(40 + (count * 15), 98); // Min 40, Max 98
            if (count === 0 && text.length > 0) level = 20; // Some knowledge if no keywords but text exists
            if (text.length === 0) level = 0;

            let strength = 'Intro';
            if (level > 85) strength = 'Elite';
            else if (level > 70) strength = 'Advanced';
            else if (level > 50) strength = 'Professional';
            else if (level > 30) strength = 'Intermediate';

            return { name: skill.name, level, strength };
        }).filter(s => s.level > 0);

        const totalStrength = extracted.reduce((acc, s) => acc + s.level, 0);
        const resScore = text.length > 0 ? Math.min(60 + (extracted.length * 5), 99) : 0;

        return {
            skills: extracted.length > 0 ? extracted : [{ name: 'Awaiting Analysis', level: 0, strength: 'None' }],
            resilience: resScore,
            strengthLabel: resScore > 85 ? 'HIGH' : resScore > 60 ? 'OPTIMAL' : 'CRITICAL',
            credits: Math.floor(text.length / 50) || 14
        };
    }, [resumeText]);

    return (
        <div className="lb-card" style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
            <div className="absolute" style={{ top: '24px', right: '24px', opacity: 0.1 }}>
                <BrainCircuit size={100} className="text-[#22d3ee]" />
            </div>

            <div className="flex justify-between items-start" style={{ marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>Intelligence Mapping</h2>
                    <div className="flex" style={{ gap: '12px' }}>
                        <span className="lb-badge accent">Resilience: {metrics.resilience}%</span>
                        <span className="lb-badge" style={{
                            color: metrics.strengthLabel === 'HIGH' ? '#10b981' : '#f59e0b',
                            borderColor: metrics.strengthLabel === 'HIGH' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                        }}>Strength: {metrics.strengthLabel}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="lb-label">Credits Utilized</p>
                    <p style={{ color: '#22d3ee', fontWeight: '900', fontSize: '18px' }}>{metrics.credits}/1000</p>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
                    {metrics.skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                            <div className="flex justify-between" style={{ marginBottom: '16px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>{skill.name}</span>
                                <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: '900' }}>{skill.level}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                                <motion.div
                                    style={{ height: '100%', backgroundColor: '#22d3ee', boxShadow: '0 0 10px #22d3ee80' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                            <p className="lb-label" style={{ fontSize: '9px' }}>Strength: {skill.strength}</p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ padding: '24px', borderRadius: '20px', backgroundColor: 'rgba(34, 211, 238, 0.03)', border: '1px solid rgba(34, 211, 238, 0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(34, 211, 238, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                        <Zap size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', color: '#fff', letterSpacing: '1px', marginBottom: '4px' }}>AI Strategic Guidance</h4>
                        <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                            {metrics.resilience > 80 ? "Your profile is tactical. Targeting Senior/Staff roles." : "Expanding keyword baseline for Junior/Professional alignment."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeSkillBox;
