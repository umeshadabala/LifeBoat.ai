import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Brain, Database, Network, ShieldAlert } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState('initial');
    const [activeAgent, setActiveAgent] = useState(null);
    const fileInputRef = useRef(null);

    const agents = [
        { id: 'parser', name: 'NEURAL_PARSER', icon: Brain, status: 'Mapping cognitive technical nodes...' },
        { id: 'mapper', name: 'STRATEGIC_BENCHMARK', icon: Database, status: 'Benchmarking industry affinity...' },
        { id: 'strategy', name: 'TACTICAL_OVERSEER', icon: Network, status: 'Synthesizing survival trajectory...' }
    ];

    const handleFile = async (file) => {
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
                if (data.error) throw new Error(data.error);
                setStep('ready');
                setTimeout(() => onComplete(data, text), 1000);
            } catch (err) {
                console.warn("INTELLIGENCE_UPLINK_FAILURE. Resorting to local heuristics.");
                setStep('ready');
                setTimeout(() => onComplete(null, text), 1000);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-max bg-[#020617] flex items-center justify-center p-6 font-primary">
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)',
                backgroundSize: '48px 48px'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lb-card w-full"
                style={{ maxWidth: '800px', padding: '80px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0f172a' }}
            >
                <AnimatePresence mode="wait">
                    {step === 'initial' && (
                        <motion.div key="i" className="text-center" exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="flex justify-center mb-10">
                                <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.1)' }}>
                                    <ShieldAlert size={48} style={{ color: '#22d3ee' }} />
                                </div>
                            </div>
                            <h1 className="lb-title-lg mb-6" style={{ fontSize: '48px', letterSpacing: '-2px' }}>STRATEGIC INTELLIGENCE UPLINK</h1>
                            <p style={{ color: '#94a3b8', marginBottom: '60px', fontSize: '20px', maxWidth: '600px', margin: '0 auto 60px' }}>
                                Deploying high-leverage AI agents to audit your experience and map a clinical career survival trajectory.
                            </p>

                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                                onClick={() => fileInputRef.current.click()}
                                className="hover-lift"
                                style={{
                                    border: '2px dashed #1e293b',
                                    borderRadius: '40px',
                                    padding: '100px 40px',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255,255,255,0.01)',
                                    transition: 'all 0.4s'
                                }}
                            >
                                <Upload size={48} style={{ color: '#22d3ee', marginBottom: '32px' }} />
                                <p style={{ fontWeight: '900', fontSize: '24px', color: '#fff' }}>UPLINK_EXPERIENCE_NODE</p>
                                <p style={{ color: '#64748b', marginTop: '12px' }}>Drop your CV / Resume to initialize.</p>
                                <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} style={{ display: 'none' }} accept=".pdf,.txt" />
                            </div>
                        </motion.div>
                    )}

                    {step === 'scanning' && activeAgent && (
                        <motion.div key="s" className="text-center py-20" initial={{ opacity: 0 }}>
                            <div className="flex justify-center mb-12">
                                <div style={{ position: 'relative' }}>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        style={{ width: '160px', height: '160px', border: '3px solid rgba(34, 211, 238, 0.1)', borderRadius: '50%', borderTopColor: '#22d3ee' }}
                                    />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#22d3ee' }}>
                                        <activeAgent.icon size={64} />
                                    </div>
                                </div>
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '4px' }}>{activeAgent.name}_ACTIVE</h2>
                            <div className="lb-badge accent" style={{ marginTop: '24px', padding: '10px 24px' }}>{activeAgent.status}</div>
                        </motion.div>
                    )}

                    {step === 'ready' && (
                        <motion.div key="r" className="text-center py-20" initial={{ opacity: 0 }}>
                            <CheckCircle size={80} style={{ color: '#10b981', margin: '0 auto 40px' }} />
                            <h2 style={{ fontSize: '40px', fontWeight: '900', color: '#fff' }}>UPLINK_SUCCESS</h2>
                            <p style={{ color: '#94a3b8', fontSize: '18px' }}>Tactical mapping is now synced across all operational hubs.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Onboarding;
