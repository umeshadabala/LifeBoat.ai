import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Brain, Database, Network, Zap, Globe } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState('initial');
    const [activeAgentIdx, setActiveAgentIdx] = useState(0);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const features = [
        { icon: Brain, label: 'AI Resume Analysis', desc: 'Deep extraction of your skills, experience, and career trajectory using Claude AI.' },
        { icon: Globe, label: 'India Job Discovery', desc: 'Real-time job listings matched to your exact skill set, based in India.' },
        { icon: Zap, label: 'Financial Runway', desc: 'Calculate your survival runway and plan strategically with precision.' },
    ];

    const agents = [
        { icon: Brain, name: 'Neural Parser', status: 'Reading and structuring resume content…' },
        { icon: Database, name: 'Skill Mapper', status: 'Identifying technical and soft skills…' },
        { icon: Network, name: 'Career Strategist', status: 'Building your professional profile…' },
    ];

    const handleFile = async (file) => {
        if (!file) return;
        setError('');
        setStep('scanning');
        setActiveAgentIdx(0);

        // Animate through agents
        for (let i = 0; i < agents.length; i++) {
            setActiveAgentIdx(i);
            await new Promise(r => setTimeout(r, 1100));
        }

        const formData = new FormData();
        formData.append('resume', file);
        if (userName.trim()) formData.append('name', userName.trim());

        try {
            const host = window.location.hostname;
            const response = await fetch(`http://${host}:5000/api/intelligence/parse`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Server error');
            }

            const data = await response.json();
            setStep('ready');
            setTimeout(() => onComplete(data, data.extractedText || ''), 900);
        } catch (err) {
            console.error('Resume parse failed:', err);
            setError(err.message || 'Failed to analyze resume. Check server logs.');
            setStep('initial');
        }
    };

    const activeAgent = agents[activeAgentIdx];

    return (
        <motion.div
            className="fixed inset-0 z-max overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: '#05080f' }}
        >
            {/* Subtle grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }} />

            {/* Glow orbs */}
            <div className="absolute pointer-events-none" style={{
                width: 600, height: 600, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
                top: '-200px', left: '-200px'
            }} />
            <div className="absolute pointer-events-none" style={{
                width: 500, height: 500, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)',
                bottom: '-100px', right: '-100px'
            }} />

            <div className="lb-container relative" style={{ padding: '80px 48px 100px' }}>
                <AnimatePresence mode="wait">

                    {/* ── INITIAL STEP ── */}
                    {step === 'initial' && (
                        <motion.div
                            key="initial"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.45 }}
                        >
                            {/* Hero */}
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 mb-8" style={{
                                    background: 'rgba(56,189,248,0.08)',
                                    border: '1px solid rgba(56,189,248,0.2)',
                                    borderRadius: 99, padding: '6px 18px',
                                    fontSize: 12, fontWeight: 700, color: '#38bdf8',
                                    letterSpacing: '1px', textTransform: 'uppercase'
                                }}>
                                    <span className="lb-dot live" /> Career Survival Engine
                                </div>

                                <h1 className="lb-display mb-6">
                                    LifeBoat<span style={{ color: '#38bdf8' }}>.ai</span>
                                </h1>
                                <p style={{
                                    color: '#94a3b8', fontSize: 18, maxWidth: 560,
                                    margin: '0 auto', lineHeight: 1.7, fontWeight: 400
                                }}>
                                    Upload your resume. Our AI extracts your skills, finds matched jobs in India, and helps you plan your financial runway.
                                </p>
                            </div>

                            {/* Name input */}
                            <div className="flex flex-col items-center gap-3 mb-8" style={{ maxWidth: 440, margin: '0 auto 32px' }}>
                                <label className="lb-label" style={{ alignSelf: 'flex-start' }}>Your Name (optional)</label>
                                <input
                                    type="text"
                                    className="lb-input"
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    placeholder="Enter your full name"
                                    style={{ textAlign: 'center', fontSize: 16 }}
                                />
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="text-center mb-6" style={{
                                    color: '#f87171', fontSize: 14, fontWeight: 600,
                                    background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                                    borderRadius: 10, padding: '12px 20px', maxWidth: 500, margin: '0 auto 24px'
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Upload zone */}
                            <div
                                className="lb-card hover-lift text-center mx-auto mb-16"
                                onClick={() => fileInputRef.current.click()}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                                style={{
                                    maxWidth: 640,
                                    cursor: 'pointer',
                                    padding: '64px 40px',
                                    background: 'rgba(56,189,248,0.025)',
                                    borderColor: 'rgba(56,189,248,0.18)',
                                    borderStyle: 'dashed',
                                    borderWidth: 1
                                }}
                            >
                                <div style={{
                                    width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
                                    background: 'rgba(56,189,248,0.1)',
                                    border: '1px solid rgba(56,189,248,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Upload size={32} color="#38bdf8" />
                                </div>
                                <h2 style={{
                                    fontFamily: 'Outfit', fontSize: 24, fontWeight: 700,
                                    color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.5px'
                                }}>Upload Your Resume</h2>
                                <p style={{ color: '#64748b', fontSize: 15 }}>
                                    Drag & drop or click to select — PDF or TXT supported
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={e => handleFile(e.target.files[0])}
                                    style={{ display: 'none' }}
                                    accept=".pdf,.txt"
                                />
                            </div>

                            {/* Feature cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: 20, maxWidth: 860, margin: '0 auto'
                            }}>
                                {features.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        className="lb-card"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        style={{ padding: '28px 24px' }}
                                    >
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                                            background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#38bdf8'
                                        }}>
                                            <f.icon size={22} />
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'Outfit', fontSize: 16, fontWeight: 700,
                                            color: '#f1f5f9', marginBottom: 8
                                        }}>{f.label}</h3>
                                        <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── SCANNING STEP ── */}
                    {step === 'scanning' && (
                        <motion.div
                            key="scanning"
                            className="flex flex-col items-center justify-center text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ minHeight: '60vh' }}
                        >
                            <div style={{ position: 'relative', marginBottom: 40 }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                    style={{
                                        width: 120, height: 120, borderRadius: '50%',
                                        border: '2px solid rgba(56,189,248,0.12)',
                                        borderTopColor: '#38bdf8', borderLeftColor: 'rgba(56,189,248,0.5)'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)', color: '#38bdf8'
                                }}>
                                    <activeAgent.icon size={40} />
                                </div>
                            </div>

                            <p className="lb-label" style={{ marginBottom: 12, color: '#38bdf8' }}>Analyzing Resume</p>
                            <h2 style={{
                                fontFamily: 'Outfit', fontSize: 28, fontWeight: 800,
                                color: '#f1f5f9', letterSpacing: '-1px', marginBottom: 16
                            }}>{activeAgent.name}</h2>
                            <p style={{ color: '#94a3b8', fontSize: 15 }}>{activeAgent.status}</p>

                            {/* Step indicators */}
                            <div className="flex items-center gap-2 mt-8">
                                {agents.map((_, i) => (
                                    <div key={i} style={{
                                        width: i === activeAgentIdx ? 20 : 6,
                                        height: 6, borderRadius: 99,
                                        background: i === activeAgentIdx ? '#38bdf8'
                                            : i < activeAgentIdx ? 'rgba(52,211,153,0.6)' : 'rgba(255,255,255,0.1)',
                                        transition: 'all 0.4s ease'
                                    }} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── READY STEP ── */}
                    {step === 'ready' && (
                        <motion.div
                            key="ready"
                            className="flex flex-col items-center justify-center text-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ minHeight: '60vh' }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                            >
                                <CheckCircle size={80} color="#34d399" style={{ marginBottom: 28 }} />
                            </motion.div>
                            <h2 style={{
                                fontFamily: 'Outfit', fontSize: 36, fontWeight: 800,
                                color: '#f1f5f9', letterSpacing: '-1.5px', marginBottom: 12
                            }}>Profile Ready</h2>
                            <p style={{ color: '#94a3b8', fontSize: 16 }}>
                                Loading your personalized dashboard…
                            </p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Onboarding;
