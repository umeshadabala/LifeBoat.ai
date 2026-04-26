import React, { useState, useMemo } from 'react';
import { Search, MapPin, DollarSign, ExternalLink, Globe, ChevronDown, Zap } from 'lucide-react';
import { jobs as localJobs } from '../data/jobs';

const JobScanner = () => {
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('All Locations');
    const [role, setRole] = useState('All Roles');
    const [salary, setSalary] = useState('All Salaries');
    const [visibleCount, setVisibleCount] = useState(12);
    const [liveNodes, setLiveNodes] = useState([]);
    const [isScraping, setIsScraping] = useState(false);

    const locations = ['All Locations', 'India', 'USA', 'UK', 'Europe', 'Australia', 'Canada', 'Singapore', 'Remote'];
    const roles = ['All Roles', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'AI/ML', 'Product'];
    const salaries = ['All Salaries', '$100k+', '$150k+', '$200k+', '₹20L+', '₹40L+'];

    const triggerLiveScrape = async () => {
        setIsScraping(true);
        try {
            const host = window.location.hostname;
            const query = `${search || 'Software Engineer'}`;
            const loc = region === 'All Locations' ? 'Global' : region;

            const response = await fetch(`http://${host}:5000/api/discovery/scrape?query=${query}&location=${loc}`);
            const data = await response.json();

            if (data.error) throw new Error(data.error);
            setLiveNodes(data);
        } catch (err) {
            console.error("SERPER_UPLINK_FAILURE:", err.message);
        }
        setIsScraping(false);
    };

    const allJobs = useMemo(() => {
        return [...liveNodes, ...localJobs];
    }, [liveNodes]);

    const filtered = useMemo(() => {
        return allJobs.filter(j => {
            const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                j.company.toLowerCase().includes(search.toLowerCase());

            const matchesRegion = region === 'All Locations' || j.location.includes(region) || (region === 'India' && (j.location.includes('Bangalore') || j.location.includes('Pune')));
            const matchesRole = role === 'All Roles' || j.title.includes(role);

            return matchesSearch && matchesRegion && matchesRole;
        });
    }, [search, region, role, salary, allJobs]);

    return (
        <div className="flex flex-col gap-12">
            <header className="flex justify-between items-end">
                <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px' }}>TACTICAL UPLINK</h2>
                    <p className="lb-label" style={{ color: '#22d3ee' }}>Aggregating 150+ verified career portal nodes.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="lb-label">ACTIVE_NODES</p>
                    <p style={{ color: '#22d3ee', fontWeight: '900', fontSize: '24px' }}>{filtered.length}</p>
                </div>
            </header>

            <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            className="lb-input"
                            placeholder="Target role or tech stack..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '64px', height: '70px', fontSize: '18px' }}
                        />
                        <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#22d3ee' }} size={24} />
                    </div>
                    <button
                        onClick={triggerLiveScrape}
                        disabled={isScraping}
                        className="lb-card hover-lift flex items-center justify-center gap-3"
                        style={{ width: '200px', height: '70px', padding: 0, background: 'rgba(34, 211, 238, 0.1)', borderColor: 'rgba(34, 211, 238, 0.2)', color: '#22d3ee', fontWeight: '900' }}
                    >
                        {isScraping ? 'SCANNING...' : <><Zap size={18} /> LIVE_FETCH</>}
                    </button>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <select className="lb-input" style={{ width: '180px', padding: '14px 20px', appearance: 'none', fontSize: '13px' }} value={region} onChange={(e) => setRegion(e.target.value)}>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select className="lb-input" style={{ width: '180px', padding: '14px 20px', appearance: 'none', fontSize: '13px' }} value={role} onChange={(e) => setRole(e.target.value)}>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {filtered.slice(0, visibleCount).map(job => (
                    <div key={job.id} className="lb-card hover-lift" style={{ padding: '32px' }}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{job.title}</h3>
                                <p className="lb-label" style={{ color: '#22d3ee' }}>{job.company}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>{job.match}% MATCH</div>
                                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '900' }}>{job.source}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 mb-8" style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                            <span className="flex items-center gap-2"><MapPin size={14} /> {job.location}</span>
                            <span className="flex items-center gap-2"><DollarSign size={14} /> {job.salary}</span>
                        </div>

                        <div className="flex justify-between items-center pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="flex gap-2">
                                {(job.tags || []).slice(0, 2).map(tag => (
                                    <span key={tag} className="lb-badge" style={{ fontSize: '8px' }}>{tag}</span>
                                ))}
                            </div>
                            <a href={job.url} target="_blank" rel="noopener noreferrer">
                                <button className="lb-badge accent hover-lift" style={{ cursor: 'pointer' }}>APPLY_NODE <ExternalLink size={12} style={{ marginLeft: '6px' }} /></button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobScanner;
