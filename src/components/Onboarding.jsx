import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Brain, Database, Network, ShieldAlert, Zap, Target, ArrowRight, Globe } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState('initial');
    const [activeAgent, setActiveAgent] = useState(null);
    const fileInputRef = useRef(null);

    const features = [
        { icon: Brain, title: "Neural Audit", desc: "Scientific deep semantic analysis of your career trajectory using elite intelligence models." },
        { icon: Globe, title: "Global Discovery", desc: "Real-time wide-web scraping for jobs and housing nodes across international hubs." },
        { icon: Zap, title: "Financial Strategy", desc: "Precision runway calculation and cost-of-living strategic analysis." }
    ];

    const agents = [
        { id: 'parser', name: 'NEURAL_PARSER', icon: Brain, status: 'Mapping cognitive technical nodes...' },
        { id: 'mapper', name: 'STRATEGIC_BENCHMARK', icon: Database, status: 'Benchmarking industry affinity...' },
        { id: 'strategy', name: 'TACTICAL_OVERSEER', icon: Network, status: 'Synthesizing survival trajectory...' }
    ];

    const handleFile = async (file) => {
        if (!file) return;
        setStep('scanning');

        for (const agent of agents) {
            setActiveAgent(agent);
            await new Promise(r => setTimeout(r, 1200));
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            try {
                const host = window.location.hostname;
                const response = await fetch(`http://${host}:5000/api/intelligence/parse`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text || "Simulated Experience Node" })
                });
                const data = await response.json();
                setStep('ready');
                setTimeout(() => onComplete(data, text), 1000);
            } catch (err) {
                setStep('ready');
                setTimeout(() => onComplete(null, text), 1000);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-max bg-[#020617] overflow-y-auto font-primary">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)',
                backgroundSize: '48px 48px'
            }} />

            <div className="lb-container" style={{ padding: '120px 40px' }}>
                <AnimatePresence mode="wait">
                    {step === 'initial' && (
                        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="flex flex-col items-center text-center mb-24">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.1)', marginBottom: '48px' }}
                                >
                                    <ShieldAlert size={48} style={{ color: '#22d3ee' }} />
                                </motion.div>
                                <h1 className="lb-title-lg mb-8">LIFEBOAT.AI</h1>
                                <p style={{ color: '#94a3b8', fontSize: '22px', maxWidth: '800px', fontWeight: '500', lineHeight: '1.6' }}>
                                    A professional tactical survival engine mapping career trajectories across global job landscapes and housing nodes.
                                </p>
                            </div>

                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                                onClick={() => fileInputRef.current.click()}
                                className="lb-card hover-lift text-center mb-24"
                                style={{ cursor: 'pointer', background: 'rgba(34, 211, 238, 0.02)', borderColor: 'rgba(34, 211, 238, 0.2)', padding: '120px 40px' }}
                            >
                                <Upload size={64} style={{ color: '#22d3ee', margin: '0 auto 32px' }} />
                                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '16px' }}>STRATEGIC INTELLIGENCE UPLINK</h2>
                                <p style={{ color: '#94a3b8', fontSize: '18px' }}>Uplink your career experience node (PDF) to initialize audit.</p>
                                <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} style={{ display: 'none' }} accept=".pdf,.txt" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', marginBottom: '120px' }}>
                                {features.map((f, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="lb-card" style={{ padding: '48px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#22d3ee' }}>
                                            <f.icon size={24} />
                                        </div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>{f.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>{f.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center" style={{ paddingTop: '60px', borderTop: '1px solid rgba(255,b255,b255,0.05)' }}>
                                <div>
                                    <p className="lb-label" style={{ color: '#22d3ee' }}>STATUS: SYSTEMS_STABLE</p>
                                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>Global Strategic Reserves Operational.</p>
                                </div>
                                <div className="flex" style={{ gap: '24px' }}>
                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>HQ: STRATEGIC_SURVIVAL_UNIT</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'scanning' && activeAgent && (
                        <motion.div key="scanning" className="text-center py-40" initial={{ opacity: 0 }}>
                            <div className="flex justify-center mb-12">
                                <div style={{ position: 'relative' }}>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        style={{ width: '180px', height: '180px', border: '3px solid rgba(34, 211, 238, 0.1)', borderRadius: '50%', borderTopColor: '#22d3ee' }}
                                    />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#22d3ee' }}>
                                        <activeAgent.icon size={80} />
                                    </div>
                                </div>
                            </div>
                            <h2 className="lb-title-lg" style={{ fontSize: '32px', letterSpacing: '4px' }}>{activeAgent.name}_ACTIVE</h2>
                            <div className="lb-badge accent" style={{ marginTop: '32px', fontSize: '14px', padding: '12px 32px' }}>{activeAgent.status}</div>
                        </motion.div>
                    )}

                    {step === 'ready' && (
                        <motion.div key="ready" className="text-center py-40" initial={{ opacity: 0 }}>
                            <CheckCircle size={100} style={{ color: '#10b981', margin: '0 auto 40px' }} />
                            <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>UPLINK_SUCCESS</h2>
                            <p style={{ color: '#94a3b8', fontSize: '20px', marginTop: '16px' }}>Tactical nodes established. Dashboard operational.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Onboarding;
