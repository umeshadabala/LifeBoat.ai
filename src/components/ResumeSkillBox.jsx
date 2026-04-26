import React, { useMemo } from 'react';
import { Briefcase, GraduationCap, Medal, User, Tag, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeSkillBox = ({ resumeText = '', externalIntelligence = null }) => {
    const m = useMemo(() => externalIntelligence || {}, [externalIntelligence]);

    const hasData = m && (m.technical_skills?.length > 0 || m.name || m.career_summary);

    if (!hasData) {
        return (
            <div className="lb-card flex flex-col items-center justify-center text-center" style={{
                minHeight: 280,
                borderStyle: 'dashed',
                borderColor: 'rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)'
            }}>
                <User size={32} style={{ color: '#334155', marginBottom: 16 }} />
                <p style={{ color: '#475569', fontSize: 14, fontWeight: 500 }}>
                    Upload your resume to see your profile
                </p>
            </div>
        );
    }

    const PillList = ({ items = [], color = '#38bdf8' }) => (
        <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
                <span key={i} style={{
                    padding: '4px 12px',
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 600,
                    background: `${color}12`,
                    border: `1px solid ${color}25`,
                    color: color
                }}>
                    {typeof item === 'string' ? item : item.name}
                </span>
            ))}
        </div>
    );

    const Section = ({ title, children, icon: Icon }) => (
        <div>
            <div className="flex items-center gap-2 mb-3">
                {Icon && <Icon size={13} style={{ color: '#475569', flexShrink: 0 }} />}
                <p className="lb-label">{title}</p>
            </div>
            {children}
        </div>
    );

    return (
        <div className="lb-card flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="lb-label mb-2">Candidate Profile</p>
                    {m.name && (
                        <h2 style={{
                            fontFamily: 'Outfit', fontSize: 22, fontWeight: 800,
                            color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: 4
                        }}>{m.name}</h2>
                    )}
                    {m.primary_role && (
                        <p style={{ fontSize: 14, color: '#38bdf8', fontWeight: 600 }}>{m.primary_role}</p>
                    )}
                </div>
                <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8'
                }}>
                    <User size={22} />
                </div>
            </div>

            {/* Summary */}
            {m.career_summary && (
                <p style={{
                    fontSize: 14, color: '#94a3b8', lineHeight: 1.7,
                    borderLeft: '2px solid rgba(56,189,248,0.3)',
                    paddingLeft: 14
                }}>{m.career_summary}</p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
                {m.years_of_experience && (
                    <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                        <Briefcase size={14} style={{ color: '#38bdf8' }} />
                        <span>{m.years_of_experience} experience</span>
                    </div>
                )}
                {m.seniority_level && (
                    <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                        <Medal size={14} style={{ color: '#818cf8' }} />
                        <span>{m.seniority_level}</span>
                    </div>
                )}
                {m.education?.length > 0 && (
                    <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                        <GraduationCap size={14} style={{ color: '#34d399' }} />
                        <span className="truncate" style={{ maxWidth: 180 }}>{m.education[0]}</span>
                    </div>
                )}
            </div>

            <hr className="lb-divider" />

            {/* Technical Skills */}
            {m.technical_skills?.length > 0 && (
                <Section title="Technical Skills" icon={Star}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 10
                    }}>
                        {m.technical_skills.slice(0, 8).map((skill, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 12, padding: '14px 16px'
                                }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{skill.name}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>{skill.level}%</span>
                                </div>
                                <div className="lb-skill-bar">
                                    <motion.div
                                        className="lb-skill-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.level}%` }}
                                        transition={{ duration: 0.8, delay: idx * 0.06 }}
                                    />
                                </div>
                                <p style={{ fontSize: 10, color: '#475569', marginTop: 6, fontWeight: 600, letterSpacing: '0.5px' }}>
                                    {skill.strength?.toUpperCase()}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Soft Skills */}
            {m.soft_skills?.length > 0 && (
                <Section title="Soft Skills" icon={Tag}>
                    <PillList items={m.soft_skills} color="#818cf8" />
                </Section>
            )}

            {/* Industry */}
            {m.industry_expertise?.length > 0 && (
                <Section title="Industry Expertise">
                    <PillList items={m.industry_expertise} color="#34d399" />
                </Section>
            )}

            {/* Previous Roles */}
            {m.previous_titles?.length > 0 && (
                <Section title="Work History" icon={Briefcase}>
                    <div className="flex flex-col gap-2">
                        {m.previous_titles.slice(0, 4).map((role, i) => (
                            <div key={i} className="flex justify-between items-start" style={{
                                padding: '10px 14px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 10
                            }}>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{role.title}</p>
                                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{role.company}</p>
                                </div>
                                {role.duration && (
                                    <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {role.duration}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Certifications */}
            {m.certifications?.length > 0 && (
                <Section title="Certifications" icon={Award}>
                    <PillList items={m.certifications} color="#fb923c" />
                </Section>
            )}
        </div>
    );
};

export default ResumeSkillBox;
