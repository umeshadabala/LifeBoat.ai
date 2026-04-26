import React, { useState, useEffect } from 'react';
import { Wallet, Timer, TrendingDown, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const FinancialHub = ({ onDataChange }) => {
    const [savings, setSavings] = useState(500000);   // ₹5 Lakhs default
    const [spending, setSpending] = useState(40000);  // ₹40k/month default
    const [runway, setRunway] = useState(0);

    useEffect(() => {
        const calc = spending > 0 ? (savings / spending) : 0;
        const rounded = Math.round(calc * 10) / 10;
        setRunway(rounded);
        if (onDataChange) onDataChange({ savings, spending, runway: rounded });
    }, [savings, spending]);

    const sustainability = Math.min((runway / 12) * 100, 100);

    const getRunwayColor = () => {
        if (runway >= 6) return '#34d399';
        if (runway >= 3) return '#fb923c';
        return '#f87171';
    };

    const formatINR = (val) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
        return `₹${val}`;
    };

    return (
        <section className="lb-card flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="lb-label mb-2">Financial Runway</p>
                    <h2 style={{
                        fontFamily: 'Outfit', fontSize: 22, fontWeight: 800,
                        color: '#f1f5f9', letterSpacing: '-0.5px'
                    }}>Survival Calculator</h2>
                    <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                        How long can you sustain your job search?
                    </p>
                </div>
                <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8'
                }}>
                    <Wallet size={22} />
                </div>
            </div>

            {/* Inputs */}
            <div className="flex gap-5">
                <div style={{ flex: 1 }}>
                    <label className="lb-label" style={{ display: 'block', marginBottom: 10 }}>
                        <IndianRupee size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        {' '}Savings / Capital
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span style={{
                            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                            color: '#38bdf8', fontSize: 18, fontWeight: 700
                        }}>₹</span>
                        <input
                            type="number"
                            className="lb-input"
                            value={savings}
                            onChange={e => setSavings(Number(e.target.value))}
                            style={{ paddingLeft: 36, fontSize: 17, fontWeight: 700, height: 56 }}
                        />
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{formatINR(savings)}</p>
                </div>

                <div style={{ flex: 1 }}>
                    <label className="lb-label" style={{ display: 'block', marginBottom: 10 }}>
                        <TrendingDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        {' '}Monthly Expenses
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span style={{
                            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                            color: '#38bdf8', fontSize: 18, fontWeight: 700
                        }}>₹</span>
                        <input
                            type="number"
                            className="lb-input"
                            value={spending}
                            onChange={e => setSpending(Number(e.target.value))}
                            style={{ paddingLeft: 36, fontSize: 17, fontWeight: 700, height: 56 }}
                        />
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{formatINR(spending)}/mo</p>
                </div>
            </div>

            {/* Runway display */}
            <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${getRunwayColor()}22`,
                borderRadius: 18, padding: '28px 32px',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Glow */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(ellipse at 50% 0%, ${getRunwayColor()}0A, transparent 70%)`
                }} />

                <div className="flex items-center justify-between relative">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Timer size={14} style={{ color: '#64748b' }} />
                            <p className="lb-label">Estimated Runway</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                            <motion.span
                                key={runway}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    fontFamily: 'Outfit', fontSize: 56, fontWeight: 900,
                                    color: getRunwayColor(), lineHeight: 1
                                }}
                            >
                                {runway.toFixed(1)}
                            </motion.span>
                            <span style={{ fontSize: 20, color: '#64748b', fontWeight: 600 }}>months</span>
                        </div>

                        <p style={{
                            fontSize: 13, marginTop: 8, fontWeight: 600,
                            color: runway >= 6 ? '#34d399' : runway >= 3 ? '#fb923c' : '#f87171'
                        }}>
                            {runway >= 9 ? 'Strong position — take your time' :
                             runway >= 6 ? 'Comfortable — focus and execute' :
                             runway >= 3 ? 'Manageable — accelerate your search' :
                             'Critical — prioritize immediately'}
                        </p>
                    </div>

                    {/* Sustainability ring */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <svg width={90} height={90} viewBox="0 0 90 90">
                            <circle cx={45} cy={45} r={38} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
                            <motion.circle
                                cx={45} cy={45} r={38} fill="none"
                                stroke={getRunwayColor()} strokeWidth={6}
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 38}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - sustainability / 100) }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                            />
                            <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
                                fill={getRunwayColor()} fontSize={15} fontWeight={800}
                                fontFamily="Outfit"
                            >{Math.round(sustainability)}%</text>
                        </svg>
                        <p className="lb-label" style={{ marginTop: 6 }}>Stability</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinancialHub;
