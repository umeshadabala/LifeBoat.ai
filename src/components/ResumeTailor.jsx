import React, { useState } from 'react';
import { FileText, Upload, Wand2, CheckCircle, Download, FileCode } from 'lucide-react';

const ResumeTailor = () => {
    const [status, setStatus] = useState('idle'); // idle, uploading, tailoring, ready

    const handleTailor = () => {
        setStatus('tailoring');
        setTimeout(() => setStatus('ready'), 3000);
    };

    return (
        <div className="glass-card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="text-accent-primary" /> ATS Tailor
                </h2>
                {status === 'ready' && (
                    <div className="flex items-center gap-1 text-success text-[10px] font-bold">
                        <CheckCircle size={14} /> OPTIMIZED
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload size={20} className="text-accent-primary" />
                        </div>
                        <p className="text-xs font-bold mb-1">UPLOAD BASE RESUME</p>
                        <p className="text-[10px] text-glass-text-dim text-balance">PDF or DOCX (Max 2MB)</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-glass-text-dim">Target Job Description</label>
                        <textarea
                            className="glass-input h-[120px] resize-none text-xs"
                            placeholder="Paste the job description here to extract keywords..."
                        />
                    </div>
                </div>

                {status === 'idle' && (
                    <button
                        onClick={handleTailor}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                    >
                        <Wand2 size={18} /> Generate Tailored Version
                    </button>
                )}

                {status === 'tailoring' && (
                    <div className="w-full py-4 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-mono animate-pulse">RESTRUCTURING SEMANTIC NODES...</p>
                    </div>
                )}

                {status === 'ready' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                                    <FileCode className="text-success" size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold">TAILORED_RESUME_v2.PDF</p>
                                    <p className="text-[9px] text-glass-text-dim">Score: 94/100 (ATS Optimized)</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-success/20 rounded-lg transition-colors">
                                <Download size={18} className="text-success" />
                            </button>
                        </div>
                        <button
                            onClick={() => setStatus('idle')}
                            className="w-full py-2 text-[10px] font-bold text-glass-text-dim hover:text-white transition-colors uppercase tracking-widest"
                        >
                            Discard and Start Over
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeTailor;
