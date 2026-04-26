import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Home, Building2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const HousingFinder = ({ location = { city: "Global Hub", region: "Global" } }) => {
    const [stays, setStays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHousing = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/housing/discovery?city=${location.city}&region=${location.region}`);
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
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '900' }}>{stays.length} NODES ACTIVE</span>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Initializing haven discovery...</div>
                ) : stays.map((stay, index) => (
                    <motion.div
                        key={stay.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover-lift"
                        style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,b255,255,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}
                    >
                        <div className="flex justify-between" style={{ marginBottom: '14px', alignItems: 'center' }}>
                            <div className="flex items-center" style={{ gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                                    <Building2 size={18} />
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{stay.name}</h3>
                            </div>
                            <span style={{ color: '#10b981', fontWeight: '900', fontSize: '16px' }}>{stay.price}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex" style={{ gap: '16px', fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                                <span className="flex items-center" style={{ gap: '4px' }}><Star size={12} fill="#22d3ee" color="#22d3ee" /> {stay.rating}</span>
                                <span className="flex items-center" style={{ gap: '4px' }}><Navigation size={12} /> {stay.location}</span>
                            </div>
                            <a href={stay.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#22d3ee', fontSize: '10px', fontWeight: '900' }} className="flex items-center gap-1">
                                VIEW <ExternalLink size={12} />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HousingFinder;
