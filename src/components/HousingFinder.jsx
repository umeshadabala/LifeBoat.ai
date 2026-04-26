import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Home, Building2, Map, Zap, DollarSign } from 'lucide-react';
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
            // BUDGET-AWARE DISCOVERY (Assumes $1000/10k budget from financial hub simulation)
            const endpoint = useLive ? `/api/discovery/scrape?query=cheapest PG rooms near me&location=${location.city}` : `/api/housing/discovery?city=${location.city}&region=${location.region}&budget=10000`;

            const response = await fetch(`http://${host}:5000${endpoint}`);
            const data = await response.json();
            setStays(data);
        } catch (err) {
            console.error("HOUSING_UPLINK_FAILURE");
        }

        setLoading(false);
        setIsScraping(false);
    };

    useEffect(() => {
        fetchHousingNodes();
    }, [location]);

    return (
        <div className="lb-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <header style={{ marginBottom: '40px' }} className="flex justify-between items-start">
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>HAVENS</h2>
                    <p className="lb-label" style={{ color: '#22d3ee', marginTop: '6px' }}>{location.city.toUpperCase()} ACCESS</p>
                </div>
                <button
                    onClick={() => fetchHousingNodes(true)}
                    disabled={isScraping}
                    className="lb-badge accent hover-lift"
                    style={{ border: '1px solid rgba(34, 211, 238, 0.4)', background: 'transparent', cursor: 'pointer' }}
                >
                    {isScraping ? 'SCANNING...' : 'LIVE_SCAN'}
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Uplink initializing...</div>
                ) : stays.map((stay, index) => (
                    <motion.div
                        key={stay.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="lb-card"
                        style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px' }}
                    >
                        <div className="flex justify-between mb-4">
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{stay.name}</h3>
                            <span style={{ color: '#10b981', fontWeight: '900', fontSize: '15px' }}>{stay.price}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#94a3b8' }}>
                                <Star size={12} style={{ color: '#22d3ee' }} /> {stay.rating}
                            </div>
                            <div className="flex" style={{ gap: '12px' }}>
                                <a
                                    href={`https://www.google.com/maps/search/${encodeURIComponent(stay.name + ' ' + stay.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="lb-badge"
                                    style={{ textDecoration: 'none', fontSize: '10px', color: '#fff' }}
                                >
                                    MAPS
                                </a>
                                <a href={stay.url} target="_blank" rel="noopener noreferrer" className="lb-badge accent" style={{ textDecoration: 'none', fontSize: '10px' }}>
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
