import React, { useState, useEffect } from 'react';
import { MapPin, Star, Home, RefreshCw, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HousingFinder = ({ location = { city: 'Bangalore', region: 'India' } }) => {
    const [stays, setStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchHousing = async () => {
        setLoading(true);
        setError('');
        try {
            const API_BASE = import.meta.env.VITE_API_URL;
            const baseUrl = API_BASE ? API_BASE.replace(/\/$/, '') : '';
            const url = `${baseUrl}/api/housing/discovery?city=${encodeURIComponent(location.city)}&region=${encodeURIComponent(location.region)}&budget=20000`;
            
            console.log(`[LifeBoat_Debug] Fetching housing from: ${url}`);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            setStays(Array.isArray(data) ? data.slice(0, 8) : []);
        } catch (err) {
            setError('Could not load housing data.');
            console.error('Housing fetch error:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHousing();
    }, [location.city]);

    return (
        <div className="lb-card flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="lb-label mb-2">Housing Discovery</p>
                    <h2 style={{
                        fontFamily: 'Outfit', fontSize: 20, fontWeight: 800,
                        color: '#f1f5f9', letterSpacing: '-0.5px'
                    }}>Near {location.city}</h2>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                        PG, flatmates & rentals
                    </p>
                </div>
                <button
                    onClick={fetchHousing}
                    disabled={loading}
                    className="lb-btn lb-btn-ghost"
                    style={{ height: 36, width: 36, padding: 0, flexShrink: 0 }}
                    title="Refresh"
                >
                    <RefreshCw size={15} style={{ animation: loading ? 'lb-spin 1s linear infinite' : 'none' }} />
                </button>
            </div>

            {/* Error */}
            {error && (
                <p style={{ fontSize: 13, color: '#f87171', fontWeight: 500 }}>{error}</p>
            )}

            {/* Skeleton */}
            {loading && (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{
                            height: 68, borderRadius: 12,
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.04)'
                        }} className="lb-pulse" />
                    ))}
                </div>
            )}

            {/* Results */}
            {!loading && (
                <div className="flex flex-col gap-3" style={{ maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
                    <AnimatePresence>
                        {stays.length === 0 && !error && (
                            <div className="text-center" style={{ padding: '32px 0', color: '#475569' }}>
                                <Home size={28} style={{ margin: '0 auto 12px' }} />
                                <p style={{ fontSize: 13 }}>No listings found for {location.city}</p>
                            </div>
                        )}
                        {stays.map((stay, idx) => (
                            <motion.div
                                key={stay.id || idx}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 12, padding: '14px 16px',
                                    transition: 'border-color 0.2s ease'
                                }}
                            >
                                <div className="flex justify-between items-start gap-3 mb-2">
                                    <p className="truncate" style={{
                                        fontSize: 14, fontWeight: 700, color: '#e2e8f0', flex: 1
                                    }}>{stay.name}</p>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <span style={{
                                            fontSize: 14, fontWeight: 800,
                                            color: '#34d399', display: 'block'
                                        }}>{stay.price}</span>
                                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{stay.type || 'PG'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3" style={{ fontSize: 12, color: '#64748b' }}>
                                            {stay.location && (
                                                <span className="flex items-center gap-1 truncate" style={{ maxWidth: 140 }}>
                                                    <MapPin size={11} style={{ color: '#64748b', flexShrink: 0 }} />
                                                    {stay.location}
                                                </span>
                                            )}
                                            {stay.rating && (
                                                <span className="flex items-center gap-1 flex-shrink-0">
                                                    <Star size={11} style={{ color: '#fb923c' }} />
                                                    {stay.rating}
                                                </span>
                                            )}
                                        </div>
                                        {stay.amenities && (
                                            <p style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>
                                                {stay.amenities}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <a
                                            href={`https://www.google.com/maps/search/${encodeURIComponent((stay.name || '') + ' ' + location.city)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="lb-badge"
                                            style={{ fontSize: 10, padding: '4px 10px' }}
                                        >Map</a>
                                        <a
                                            href={stay.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="lb-badge accent"
                                            style={{ fontSize: 10, padding: '4px 10px' }}
                                        >
                                            View <ExternalLink size={9} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Source note */}
            <p style={{ fontSize: 11, color: '#334155', marginTop: 'auto' }}>
                Data via OpenStreetMap & real-time search
            </p>
        </div>
    );
};

export default HousingFinder;
