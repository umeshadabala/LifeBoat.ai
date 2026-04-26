import React, { useMemo } from 'react';
import { Target, BrainCircuit, Activity, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { extractIntelligence } from '../services/Parser';

const ResumeSkillBox = ({ resumeText = "" }) => {
    const metrics = useMemo(() => extractIntelligence(resumeText), [resumeText]);

    if (!metrics.skills || metrics.skills.length === 0) {
        return (
            <div className="lb-card" style={{ border: '1px dashed #1e293b', background: 'transparent' }}>
                <p className="text-center" style={{ color: '#64748b', fontStyle: 'italic' }}>Awaiting neural uplink... Deploy agents to begin extraction.</p>
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
                            <TrendingUp size={14} /> STRENGTH: {metrics.strengthLabel}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                    {metrics.skills.map((skill, index) => (
                        <motion.div
                            key={`${skill.name}-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                            <div className="flex justify-between" style={{ marginBottom: '16px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>{skill.name}</span>
                                <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: '900' }}>{skill.level}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                                <motion.div
                                    style={{ height: '100%', backgroundColor: '#22d3ee', boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1.5 }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="lb-label" style={{ fontSize: '8px' }}>MAPPED_DATA_STREAM</p>
                                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{skill.strength}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeSkillBox;
