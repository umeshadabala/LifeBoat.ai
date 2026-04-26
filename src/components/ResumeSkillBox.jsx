import React, { useMemo } from 'react';
import { Target, BrainCircuit, Activity, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { extractIntelligence } from '../services/Parser';

const ResumeSkillBox = ({ resumeText = "", externalIntelligence = null }) => {
    // Use backend intelligence if available, otherwise fallback to local heuristics
    const metrics = useMemo(() => {
        return externalIntelligence || extractIntelligence(resumeText);
    }, [resumeText, externalIntelligence]);

    if (!metrics.skills || metrics.skills.length === 0) {
        return (
            <div className="lb-card" style={{ border: '1px dashed #1e293b', background: 'transparent' }}>
                <p className="text-center" style={{ color: '#64748b', fontStyle: 'italic' }}>Waiting for intelligence uplink...</p>
            </div>
        );
    }

    return (
        <div className="lb-card" style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
            <div className="absolute" style={{ top: '24px', right: '24px', opacity: 0.1 }}>
                <BrainCircuit size={100} className="text-[#22d3ee]" />
            </div>

            <div className="flex justify-between items-start" style={{ marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>Intelligence Mapping</h2>
                    <div className="flex" style={{ gap: '12px', alignItems: 'center' }}>
                        <span className="lb-badge accent" style={{ background: 'rgba(34, 211, 238, 0.1)' }}>Resilience: {metrics.resilience}%</span>
                        <div className="flex items-center" style={{ gap: '6px', color: '#10b981', fontSize: '10px', fontWeight: '900' }}>
                            <TrendingUp size={14} /> {externalIntelligence ? 'LLM_SOURCE' : 'LOCAL_HEURISTICS'}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                {metrics.skills.map((skill, index) => (
                    <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="lb-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)' }}>
                        <div className="flex justify-between" style={{ marginBottom: '12px' }}>
                            <span style={{ fontWeight: '800' }}>{skill.name}</span>
                            <span style={{ color: '#22d3ee' }}>{skill.level}%</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} style={{ height: '100%', background: '#22d3ee' }} />
                        </div>
                        <p className="lb-label" style={{ marginTop: '8px', fontSize: '8px' }}>{skill.strength}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ResumeSkillBox;
