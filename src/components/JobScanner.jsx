import React, { useState, useMemo } from 'react';
import { Search, MapPin, DollarSign, ExternalLink, Globe, ChevronDown } from 'lucide-react';
import { jobs as localJobs } from '../data/jobs';
import { fetchRealtimeJobs } from '../services/SearchService';

const JobScanner = () => {
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('All Locations');
    const [role, setRole] = useState('All Roles');
    const [salary, setSalary] = useState('All Salaries');
    const [visibleCount, setVisibleCount] = useState(12);
    const [realtimeJobs, setRealtimeJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const locations = ['All Locations', 'India', 'USA', 'UK', 'Europe', 'Australia', 'Canada', 'Singapore', 'Remote'];
    const roles = ['All Roles', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'AI/ML', 'Product'];
    const salaries = ['All Salaries', '$100k+', '$150k+', '$200k+', '₹20L+', '₹40L+'];

    const triggerLiveSearch = async () => {
        setIsLoading(true);
        const results = await fetchRealtimeJobs(search, { region, role });
        if (results) setRealtimeJobs(results);
        setIsLoading(false);
    };

    const allJobs = useMemo(() => {
        return [...realtimeJobs, ...localJobs];
    }, [realtimeJobs]);

    const filtered = useMemo(() => {
        return allJobs.filter(j => {
            const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                j.company.toLowerCase().includes(search.toLowerCase()) ||
                j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

            const matchesRegion = region === 'All Locations' ||
                (region === 'India' && (j.location.includes('India') || j.location.includes('Bangalore') || j.location.includes('Mumbai'))) ||
                (region === 'USA' && (j.location.includes('USA') || j.location.includes('SF') || j.location.includes('Mountain View'))) ||
                (region === 'Europe' && (j.location.includes('Berlin') || j.location.includes('Stockholm') || j.location.includes('Europe'))) ||
                (region === 'UK' && j.location.includes('London')) ||
                (j.location.includes(region));

            const matchesRole = role === 'All Roles' || j.title.includes(role) || j.tags.includes(role);
            const matchesSalary = salary === 'All Salaries' || j.salary.includes(salary.replace('+', ''));

            return matchesSearch && matchesRegion && matchesRole && matchesSalary;
        });
    }, [search, region, role, salary, allJobs]);

    const displayedJobs = filtered.slice(0, visibleCount);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <header className="flex justify-between items-end">
                <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff' }}>TACTICAL UPLINK</h2>
                    <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: '500' }}>Aggregating 100+ global sources with optional Live Scraping.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="lb-label" style={{ marginBottom: '4px' }}>Fresh Nodes</p>
                    <p style={{ color: '#22d3ee', fontWeight: '900', fontSize: '24px' }}>{filtered.length}</p>
                </div>
            </header>

            {/* Advanced Filter Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            className="lb-input"
                            placeholder="Strategic search (e.g. Node.js at Vercel)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '64px', height: '70px', fontSize: '18px' }}
                        />
                        <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#22d3ee' }} size={24} />
                    </div>
                    <button
                        onClick={triggerLiveSearch}
                        disabled={isLoading}
                        className="lb-btn-primary"
                        style={{ height: '70px', width: '200px', backgroundColor: 'transparent', border: '1px solid #22d3ee', color: '#22d3ee' }}
                    >
                        {isLoading ? 'SCANNING...' : 'LIVE FETCH'}
                    </button>
                </div>

                <div className="flex" style={{ gap: '16px', flexWrap: 'wrap' }}>
                    {/* Dropdowns logic remains the same */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                        <select className="lb-input hover-border" style={{ padding: '14px 20px', appearance: 'none', fontSize: '12px' }} value={region} onChange={(e) => setRegion(e.target.value)}>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                    </div>
                    {/* Role/Salary Dropdowns... */}
                </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {displayedJobs.map(job => (
                    <div key={job.id} className="lb-card hover-lift" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{job.title}</h3>
                                <p style={{ fontSize: '12px', fontWeight: '900', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{job.company}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>{job.match}% MATCH</div>
                                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '900' }}>{job.source.toUpperCase()}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                            <span className="flex items-center" style={{ gap: '6px' }}><MapPin size={14} /> {job.location}</span>
                            <span className="flex items-center" style={{ gap: '6px' }}><DollarSign size={14} /> {job.salary}</span>
                        </div>

                        <div className="flex justify-between items-center" style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="flex" style={{ gap: '6px' }}>
                                {job.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="lb-badge" style={{ fontSize: '8px' }}>{tag}</span>
                                ))}
                            </div>
                            <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <button className="lb-btn-primary" style={{ padding: '10px 16px', fontSize: '10px' }}>APPLY <ExternalLink size={12} style={{ marginLeft: '6px' }} /></button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobScanner;
