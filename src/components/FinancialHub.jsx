import React, { useState, useEffect } from 'react';
import { Wallet, Timer, Activity, TrendingUp } from 'lucide-react';

const FinancialHub = ({ currency = '$', onDataChange }) => {
    const [savings, setSavings] = useState(15000);
    const [spending, setSpending] = useState(2500);
    const [runway, setRunway] = useState(0);

    useEffect(() => {
        const calc = spending > 0 ? (savings / spending).toFixed(1) : 0;
        setRunway(calc);
        if (onDataChange) onDataChange({ savings, spending, runway: calc });
    }, [savings, spending]);

    return (
        <section className="lb-card">
            <header className="flex justify-between items-center" style={{ marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Tactical Runway</h2>
                    <span className="lb-badge accent">Real-time analysis</span>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#1e293b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet style={{ color: '#22d3ee' }} size={24} />
                </div>
            </header>

            <div className="flex" style={{ gap: '40px', marginBottom: '40px' }}>
                <div style={{ flex: 1 }}>
                    <label className="lb-label" style={{ display: 'block', marginBottom: '10px' }}>Capital Reserves</label>
                    <input
                        type="number"
                        className="lb-input"
                        style={{ fontSize: '24px', fontWeight: '900' }}
                        value={savings}
                        onChange={(e) => setSavings(Number(e.target.value))}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="lb-label" style={{ display: 'block', marginBottom: '10px' }}>Monthly Burn</label>
                    <input
                        type="number"
                        className="lb-input"
                        style={{ fontSize: '24px', fontWeight: '900' }}
                        value={spending}
                        onChange={(e) => setSpending(Number(e.target.value))}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: '#020617', borderRadius: '32px', padding: '40px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden' }}>
                <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1, gap: '40px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p className="lb-label" style={{ marginBottom: '10px' }}><Timer size={14} /> Estimated Survival</p>
                        <div style={{ fontSize: '64px', fontWeight: '900', color: '#22d3ee' }}>
                            {runway} <span style={{ fontSize: '20px', color: '#94a3b8' }}>Months</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, maxWidth: '300px' }}>
                        <div className="flex justify-between" style={{ marginBottom: '10px' }}>
                            <span className="lb-label">Sustainability</span>
                            <span style={{ fontWeight: 'bold' }}>{Math.min((runway / 12) * 100, 100).toFixed(0)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min((runway / 12) * 100, 100)}%`, backgroundColor: '#22d3ee' }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinancialHub;
