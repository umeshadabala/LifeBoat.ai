import React from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';

const HousingFinder = () => {
    const stays = [
        { name: 'Skyloft Residency', price: '$850', rating: 4.9 },
        { name: 'Urban Pods', price: '$600', rating: 4.7 }
    ];

    return (
        <div className="lb-card" style={{ position: 'relative' }}>
            <header style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Havens</h2>
                <span className="lb-label">Strategic Housing</span>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {stays.map(stay => (
                    <div key={stay.name} style={{ padding: '20px', borderRadius: '16px', border: '1px solid #1e293b', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                        <div className="flex justify-between" style={{ marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>{stay.name}</h3>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{stay.price}</span>
                        </div>
                        <div className="flex" style={{ gap: '16px', fontSize: '10px', color: '#64748b' }}>
                            <span className="flex items-center" style={{ gap: '4px', color: '#22d3ee' }}><Star size={12} fill="currentColor" /> {stay.rating}</span>
                            <span className="flex items-center" style={{ gap: '4px' }}><Navigation size={12} /> Near Hub</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HousingFinder;
