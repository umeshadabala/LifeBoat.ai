import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Home, Building2, ExternalLink, Map, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HousingFinder = ({ location = { city: "Global Hub", region: "Global" } }) => {
    const [stays, setStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isScraping, setIsScraping] = useState(false);

    const fetchHousingNodes = async (useLive = false) => {
        if (useLive) setIsScraping(true);
        else setLoading(true);

        try {
            const host = window.location.hostname;
            const endpoint = useLive ? `/api/discovery/scrape?query=PG rooms dorms&location=${location.city}` : `/api/housing/discovery?city=${location.city}&region=${location.region}`;

            const response = await fetch(`http://${host}:5000${endpoint}`);
            const data = await response.json();

            if (data.error) throw new Error(data.error);
            setStays(data);
        } catch (err) {
            console.error("HOUSING_UPLINK_FAILURE:", err.message);
        }

        setLoading(false);
        setIsScraping(false);
    };

    useEffect(() => {
        fetchHousingNodes();
    }, [location]);

    return (
        <div className="lb-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="absolute" style={{ top: '24px', right: '24px', opacity: 0.1, color: '#22d3ee' }}>
                <Home size={80} />
            </div>

            <header style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }} className="flex justify-between items-start">
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>HAVENS</h2>
                    <p className="lb-label" style={{ color: '#22d3ee', marginTop: '4px' }}>{location.city} PROXIMITY</p>
                </div>
                <button
                    onClick={() => fetchHousingNodes(true)}
                    disabled={isScraping}
                    className="lb-badge accent hover-lift"
                    style={{ border: '1px solid rgba(34, 211, 238, 0.4)', background: 'rgba(34, 211, 238, 0.05)', cursor: 'pointer' }}
                >
                    {isScraping ? 'SCANNING...' : <><Zap size={10} /> LIVE_SCAN</>}
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Establishing secure connection...</div>
                ) : stays.map((stay, index) => (
                    <motion.div
                        key={stay.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="lb-card"
                        style={{ padding: '24px', background: 'rgba(255,b255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div className="flex justify-between" style={{ marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{stay.name}</h3>
                            <span style={{ color: '#10b981', fontWeight: '900' }}>{stay.price}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex" style={{ gap: '12px', fontSize: '11px', color: '#94a3b8' }}>
                                <span className="flex items-center gap-1"><Star size={12} fill="#22d3ee" color="#22d3ee" /> {stay.rating || '4.8'}</span>
                            </div>
                            <div className="flex" style={{ gap: '12px' }}>
                                <a
                                    href={`https://www.google.com/maps/search/${encodeURIComponent(stay.name + ' ' + stay.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="lb-badge accent hover-lift"
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Map size={12} /> MAPS
                                </a>
                                <a href={stay.url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', borderRadius: '8px', background: '#fff', color: '#020617', textDecoration: 'none', fontSize: '10px', fontWeight: '900' }}>
                                    VIEW
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HousingFinder;
