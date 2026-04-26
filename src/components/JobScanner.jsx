import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ExternalLink, Briefcase, RefreshCw, IndianRupee, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REGIONS = [
    { label: 'India', value: 'India' },
    { label: 'Remote', value: 'Remote' },
    { label: 'USA', value: 'USA' },
    { label: 'UK', value: 'UK' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'Canada', value: 'Canada' },
    { label: 'Australia', value: 'Australia' },
];

const JobScanner = ({ skills = [], primaryRole = '' }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState('India');
    const [searchText, setSearchText] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [visibleCount, setVisibleCount] = useState(9);
    const [error, setError] = useState('');

    const fetchJobs = useCallback(async (overrideSkills = null, overrideRegion = null) => {
        setLoading(true);
        setError('');
        try {
            const host = window.location.hostname;
            const targetSkills = overrideSkills ?? skills;
            const targetRegion = overrideRegion ?? region;

            // Build query: prefer skills array, fall back to manual search text or primary role
            let queryParam = '';
            let skillsParam = '';

            if (targetSkills.length > 0) {
                skillsParam = `&skills=${encodeURIComponent(JSON.stringify(targetSkills.slice(0, 6)))}`;
                queryParam = `&query=${encodeURIComponent(targetSkills.slice(0, 2).join(' '))}`;
            } else {
                const q = searchText.trim() || primaryRole || 'Software Engineer';
                queryParam = `&query=${encodeURIComponent(q)}`;
            }

            const url = `http://${host}:5000/api/jobs/discovery?region=${encodeURIComponent(targetRegion)}${queryParam}${skillsParam}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
            setHasLoaded(true);
            setVisibleCount(9);
        } catch (err) {
            console.error('Job fetch error:', err);
            setError('Could not load jobs. Make sure the backend server is running.');
            setJobs([]);
        }
        setLoading(false);
    }, [skills, region, searchText, primaryRole]);

    // Auto-fetch when skills or region change
    useEffect(() => {
        if (skills.length > 0 || primaryRole) {
            fetchJobs();
        }
    }, [skills.join(','), region]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(searchText ? [] : skills);
    };

    const displayed = jobs.slice(0, visibleCount);

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="lb-label mb-2">Live Discovery</p>
                    <h2 style={{
                        fontFamily: 'Outfit', fontSize: 28, fontWeight: 800,
                        color: '#f1f5f9', letterSpacing: '-1px'
                    }}>
                        Job Opportunities
                        <span style={{ color: '#38bdf8' }}> in {region}</span>
                    </h2>
                    {skills.length > 0 && (
                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
                            Matched to: {skills.slice(0, 5).join(', ')}{skills.length > 5 ? ` +${skills.length - 5} more` : ''}
                        </p>
                    )}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="lb-label mb-1">Positions Found</p>
                    <p style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
                        {jobs.length}
                    </p>
                </div>
            </div>

            {/* Search + Filters */}
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                    {/* Country Filter */}
                    <div className="relative flex-1" style={{ minWidth: 200 }}>
                        <MapPin size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                        <select
                            className="lb-input"
                            value={region}
                            onChange={e => setRegion(e.target.value)}
                            style={{ paddingLeft: 44, height: 52, fontSize: 15, appearance: 'none', backgroundColor: 'rgba(255,255,255,0.02)' }}
                        >
                            {REGIONS.map(r => (
                                <option key={r.value} value={r.value} style={{ background: '#0f172a' }}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Skill / Role Filter */}
                    <div className="relative flex-1" style={{ minWidth: 240 }}>
                        <Filter size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                        <select
                            className="lb-input"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ paddingLeft: 44, height: 52, fontSize: 15, appearance: 'none', backgroundColor: 'rgba(255,255,255,0.02)' }}
                        >
                            <option value="" style={{ background: '#0f172a' }}>All Matched Roles & Skills</option>
                            {primaryRole && <option value={primaryRole} style={{ background: '#0f172a' }}>Role: {primaryRole}</option>}
                            {skills.map((skill, i) => (
                                <option key={i} value={skill} style={{ background: '#0f172a' }}>Skill: {skill}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="lb-btn lb-btn-primary"
                        disabled={loading}
                        style={{ height: 52, minWidth: 120, flexShrink: 0 }}
                    >
                        {loading ? (
                            <><span className="lb-spinner" style={{ width: 16, height: 16 }} /> Searching</>
                        ) : (
                            <><Search size={16} /> Search</>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => fetchJobs()}
                        className="lb-btn lb-btn-ghost"
                        disabled={loading}
                        style={{ height: 52, width: 52, padding: 0, flexShrink: 0 }}
                        title="Refresh"
                    >
                        <RefreshCw size={17} />
                    </button>
                </div>
            </form>

            {/* Error */}
            {error && (
                <div style={{
                    padding: '14px 20px', borderRadius: 12, fontSize: 14,
                    background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.18)',
                    color: '#f87171', fontWeight: 500
                }}>{error}</div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 20
                }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="lb-card" style={{ padding: 24, minHeight: 160 }}>
                            <div style={{ height: 16, width: '70%', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 10 }} className="lb-pulse" />
                            <div style={{ height: 12, width: '45%', background: 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: 20 }} className="lb-pulse" />
                            <div style={{ height: 10, width: '35%', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }} className="lb-pulse" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && hasLoaded && jobs.length === 0 && (
                <div className="lb-card text-center" style={{
                    padding: '60px 40px',
                    borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.01)'
                }}>
                    <Briefcase size={36} style={{ color: '#334155', margin: '0 auto 16px' }} />
                    <p style={{ color: '#64748b', fontSize: 15 }}>No jobs found. Try a different region or search term.</p>
                </div>
            )}

            {/* Job Grid */}
            {!loading && displayed.length > 0 && (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 20
                    }}>
                        <AnimatePresence>
                            {displayed.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    className="lb-card hover-lift"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}
                                >
                                    {/* Title + Match */}
                                    <div className="flex justify-between items-start gap-3">
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h3 className="truncate" style={{
                                                fontSize: 15, fontWeight: 700,
                                                color: '#f1f5f9', marginBottom: 4
                                            }}>{job.title}</h3>
                                            <p style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600 }}>{job.company}</p>
                                        </div>
                                        <div style={{
                                            flexShrink: 0, textAlign: 'right',
                                            background: `rgba(${job.match > 90 ? '52,211,153' : '56,189,248'},0.08)`,
                                            border: `1px solid rgba(${job.match > 90 ? '52,211,153' : '56,189,248'},0.2)`,
                                            borderRadius: 10, padding: '6px 10px'
                                        }}>
                                            <p style={{
                                                fontSize: 16, fontWeight: 800, lineHeight: 1,
                                                color: job.match > 90 ? '#34d399' : '#38bdf8'
                                            }}>{job.match}%</p>
                                            <p style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: '0.5px', marginTop: 2 }}>MATCH</p>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex flex-wrap gap-3" style={{ fontSize: 12, color: '#64748b' }}>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} style={{ color: '#38bdf8' }} />
                                            {job.location}
                                        </span>
                                        {job.salary && job.salary !== 'Competitive' && (
                                            <span className="flex items-center gap-1" style={{ color: '#34d399', fontWeight: 600 }}>
                                                <IndianRupee size={11} />
                                                {job.salary.replace('₹', '')}
                                            </span>
                                        )}
                                        {job.salary === 'Competitive' && (
                                            <span style={{ color: '#475569' }}>Competitive</span>
                                        )}
                                    </div>

                                    {/* Description snippet */}
                                    {job.description && (
                                        <p style={{
                                            fontSize: 12, color: '#475569', lineHeight: 1.6,
                                            display: '-webkit-box', WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                        }}>{job.description}</p>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3" style={{
                                        borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto'
                                    }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
                                            color: '#334155', textTransform: 'uppercase'
                                        }}>{job.source?.replace('_', ' ')}</span>
                                        <div className="flex gap-2">
                                            <a
                                                href={job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="lb-btn lb-btn-ghost"
                                                style={{ height: 36, padding: '0 16px', fontSize: 13 }}
                                            >
                                                Apply <ExternalLink size={13} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Load more */}
                    {visibleCount < jobs.length && (
                        <div className="text-center">
                            <button
                                className="lb-btn lb-btn-ghost"
                                onClick={() => setVisibleCount(v => v + 9)}
                                style={{ padding: '12px 32px', fontSize: 14 }}
                            >
                                Load more ({jobs.length - visibleCount} remaining)
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobScanner;
