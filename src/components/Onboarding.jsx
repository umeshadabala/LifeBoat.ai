import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, Shield } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState('initial');
    const fileInputRef = useRef(null);

    const simulateExtraction = (file) => {
        setStep('scanning');
        // Simulate reading text from file
        const mockText = `I am a Senior React.js Developer with 5 years of experience in TypeScript and Node.js. 
    I have built complex System Design architectures and deployed DevOps pipelines using Docker and AWS.
    Experience at Google and Vercel. Performance optimization and Frontend leadership.`;

        setTimeout(() => {
            onComplete(mockText); // Pass the extracted text back
            setStep('ready');
        }, 4000);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            simulateExtraction(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            simulateExtraction(e.dataTransfer.files[0]);
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
                            <h1 className="lb-title-lg mb-4">Initialize Intelligence</h1>
                            <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '18px', fontWeight: '500' }}>
                                Upload your resume to calibrate your survival strategy.
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
                                <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Drop PDF/Word here</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx" />
                            </div>
                        </motion.div>
                    )}

                    {step === 'scanning' && (
                        <motion.div key="s" className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-center mb-10">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} style={{ width: '80px', height: '80px', border: '5px solid rgba(34, 211, 238, 0.1)', borderRadius: '50%', borderTopColor: '#22d3ee' }} />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>DEEP PARSING ACTIVE</h2>
                            <p className="lb-label" style={{ marginTop: '12px', letterSpacing: '0.3em' }}>Extracting semantic experience nodes...</p>
                        </motion.div>
                    )}

                    {step === 'ready' && (
                        <motion.div key="r" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                                <CheckCircle size={40} style={{ color: '#10b981' }} />
                            </div>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '12px' }}>Uplink Ready</h2>
                            <button onClick={() => window.location.reload()} className="lb-btn-primary w-full" style={{ padding: '20px' }}>Enter Command Center</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Onboarding;
