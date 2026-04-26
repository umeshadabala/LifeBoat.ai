import React, { useState, useMemo } from 'react';
import { Search, MapPin, DollarSign, ExternalLink, Zap, Globe } from 'lucide-react';
import { jobs as localJobs } from '../data/jobs';

const JobScanner = () => {
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('All Locations');
    const [role, setRole] = useState('All Roles');
    const [visibleCount, setVisibleCount] = useState(12);
    const [liveNodes, setLiveNodes] = useState([]);
    const [isScraping, setIsScraping] = useState(false);

    const locations = ['All Locations', 'India', 'USA', 'UK', 'Europe', 'Australia', 'Canada', 'Singapore', 'Remote'];
    const roles = ['All Roles', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'AI/ML', 'Product'];

    const triggerLiveScrape = async () => {
        setIsScraping(true);
        try {
            const host = window.location.hostname;
            const response = await fetch(`http://${host}:5000/api/discovery/scrape?query=${search || 'Software Engineer'}&location=${region}`);
            const data = await response.json();
            setLiveNodes(data);
        } catch (err) {
            console.warn("DISCOVERY_UPLINK_FAILURE");
        }
        setIsScraping(false);
    };

    const allJobs = useMemo(() => {
        // INTERNATIONAL FIRST SORTING
        const joined = [...liveNodes, ...localJobs];
        return joined.sort((a, b) => {
            const aIsIntl = !a.location.includes('India') && !a.location.includes('Bangalore');
            const bIsIntl = !b.location.includes('India') && !b.location.includes('Bangalore');
            if (aIsIntl && !bIsIntl) return -1;
            if (!aIsIntl && bIsIntl) return 1;
            return b.match - a.match;
        });
    }, [liveNodes]);

    const filtered = useMemo(() => {
        return allJobs.filter(j => {
            const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                j.company.toLowerCase().includes(search.toLowerCase());
            const matchesRegion = region === 'All Locations' || j.location.includes(region);
            return matchesSearch && matchesRegion;
        });
    }, [search, region, allJobs]);

    return (
        <div className="flex flex-col gap-16">
            <header className="flex justify-between items-end">
                <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px' }}>TACTICAL UPLINK</h2>
                    <p className="lb-label" style={{ color: '#22d3ee' }}>Aggregating global career nodes.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="lb-label">ACTIVE_FLIGHTS</p>
                    <p style={{ color: '#22d3ee', fontWeight: '900', fontSize: '24px' }}>{filtered.length}</p>
                </div>
            </header>

            <div className="flex flex-col gap-8">
                <div className="flex gap-4">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            className="lb-input"
                            placeholder="Target role or international hub..."
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
                        style={{ width: '220px', height: '70px', padding: 0, background: 'rgba(34, 211, 238, 0.05)', borderColor: 'rgba(34, 211, 238, 0.2)', color: '#22d3ee', fontWeight: '900' }}
                    >
                        {isScraping ? 'SCANNING...' : <><Zap size={18} /> LIVE_FETCH</>}
                    </button>
                </div>

                <div className="flex gap-4">
                    <select className="lb-input" style={{ width: '200px', height: '60px' }} value={region} onChange={(e) => setRegion(e.target.value)}>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                {filtered.slice(0, visibleCount).map(job => (
                    <div key={job.id} className="lb-card hover-lift" style={{ padding: '32px' }}>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{job.title}</h3>
                                <p className="lb-label" style={{ color: '#22d3ee' }}>{job.company}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>{job.match}% MATCH</div>
                                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '900' }}>{job.source.toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 mb-8" style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                            <span className="flex items-center gap-2"><MapPin size={14} /> {job.location}</span>
                            <span className="flex items-center gap-2"><DollarSign size={14} /> {job.salary}</span>
                        </div>

                        <div className="flex justify-between items-center pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
                                <button className="lb-input" style={{ background: '#fff', color: '#020617', fontWeight: '900', padding: '14px', cursor: 'pointer', border: 'none' }}>
                                    APPLY_NODE <ExternalLink size={14} style={{ marginLeft: '8px' }} />
                                </button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobScanner;
