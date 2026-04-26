import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Home, Building2, ExternalLink, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const HousingFinder = ({ location = { city: "Global Hub", region: "Global" } }) => {
    const [stays, setStays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHousing = async () => {
            setLoading(true);
            try {
                const host = window.location.hostname;
                const response = await fetch(`http://${host}:5000/api/housing/discovery?city=${location.city}&region=${location.region}`);
                const data = await response.json();
                setStays(data);
            } catch (err) {
                console.error("Housing uplink failure:", err);
            }
            setLoading(false);
        };
        fetchHousing();
    }, [location]);

    return (
        <div className="lb-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="absolute" style={{ top: '24px', right: '24px', opacity: 0.1, color: '#22d3ee' }}>
                <Home size={80} />
            </div>

            <header style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>HAVENS</h2>
                <div className="flex" style={{ gap: '10px', alignItems: 'center' }}>
                    <span className="lb-badge accent" style={{ background: 'rgba(34, 211, 238, 0.1)' }}>{location.city} PROXIMITY</span>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Initializing...</div>
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
                                <span className="flex items-center gap-1"><Star size={12} fill="#22d3ee" color="#22d3ee" /> {stay.rating}</span>
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
