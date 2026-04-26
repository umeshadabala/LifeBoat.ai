import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Shield, Brain, Cpu, Database, Network } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState('initial');
    const [activeAgent, setActiveAgent] = useState(null);
    const fileInputRef = useRef(null);

    const agents = [
        { id: 'parser', name: 'NEURAL_PARSER', icon: Brain, status: 'Analyzing experience nodes...' },
        { id: 'mapper', name: 'INDUSTRY_MAPPER', icon: Database, status: 'Benchmarking skill affinity...' },
        { id: 'strategy', name: 'TAC_STRATEGIST', icon: Network, status: 'Synthesizing career trajectory...' }
    ];

    const handleFile = async (file) => {
        setStep('scanning');

        // 1. START AGENT PIPELINE (Visual Only)
        for (const agent of agents) {
            setActiveAgent(agent);
            await new Promise(r => setTimeout(r, 1000));
        }

        // 2. REAL-TIME TEXT EXTRACTION (Basic FileReader)
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;

            try {
                // UPLINK TO NODE.JS BACKEND
                const response = await fetch('http://localhost:5000/api/intelligence/parse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text || "Simulated Resume Node" })
                });
                const data = await response.json();

                if (data.error) throw new Error(data.error);

                setStep('ready');
                setTimeout(() => onComplete(data, text), 1000);
            } catch (err) {
                console.warn("Backend link failed. Falling back to local engine.", err);
                setStep('ready');
                setTimeout(() => onComplete(null, text), 1000);
            }
        };
        reader.readAsText(file);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 z-max bg-[#020617] flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-10" style={{ overflow: 'hidden' }}>
                <div className="absolute rounded-full blur-xl" style={{ top: '20%', left: '10%', width: '400px', height: '400px', backgroundColor: '#22d3ee' }} />
                <div className="absolute rounded-full blur-xl" style={{ bottom: '20%', right: '10%', width: '400px', height: '400px', backgroundColor: '#10b981' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lb-card relative z-10 w-full"
                style={{ maxWidth: '640px', padding: '60px' }}
            >
                <AnimatePresence mode="wait">
                    {step === 'initial' && (
                        <motion.div key="i" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h1 className="lb-title-lg mb-4">Initialize Agents</h1>
                            <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '18px', fontWeight: '500' }}>
                                Deploy AI agents to map your career survival strategy.
                            </p>

                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current.click()}
                                style={{
                                    border: '2px dashed #1e293b',
                                    borderRadius: '32px',
                                    padding: '60px 20px',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255,255,255,0.01)',
                                    transition: 'all 0.3s'
                                }}
                                className="hover-lift"
                            >
                                <div style={{ padding: '20px', backgroundColor: 'rgba(34, 211, 238, 0.1)', display: 'inline-flex', borderRadius: '20px', marginBottom: '20px' }}>
                                    <Upload size={40} style={{ color: '#22d3ee' }} />
                                </div>
                                <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Uplink Resume</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt" />
                            </div>
                        </motion.div>
                    )}

                    {step === 'scanning' && activeAgent && (
                        <motion.div key="s" className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-center mb-10">
                                <div style={{ position: 'relative' }}>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        style={{ width: '120px', height: '120px', border: '2px solid rgba(34, 211, 238, 0.2)', borderRadius: '50%', borderTopColor: '#22d3ee' }}
                                    />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#22d3ee' }}>
                                        <activeAgent.icon size={48} />
                                    </div>
                                </div>
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '2px' }}>{activeAgent.name} ACTIVE</h2>
                            <p className="lb-badge accent" style={{ marginTop: '16px' }}>{activeAgent.status}</p>
                        </motion.div>
                    )}

                    {step === 'ready' && (
                        <motion.div key="r" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                                <CheckCircle size={40} style={{ color: '#10b981' }} />
                            </div>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '12px' }}>Uplink Success</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Tactical mapping is now synced across all active nodes.</p>
                            <div style={{ width: '100%', height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} style={{ height: '100%', backgroundColor: '#10b981' }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Onboarding;
