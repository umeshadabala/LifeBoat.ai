import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, ExternalLink, Copy, CheckCircle, Shield } from 'lucide-react';

const steps = [
    {
        num: 1,
        title: 'Create an OpenRouter Account',
        desc: 'Go to openrouter.ai and click "Sign Up". You can sign up with Google, GitHub, or email.',
        link: 'https://openrouter.ai/auth/register',
        linkLabel: 'Sign Up on OpenRouter'
    },
    {
        num: 2,
        title: 'Navigate to API Keys',
        desc: 'After signing in, click your profile icon in the top-right, then go to "Keys" page. Or directly visit the link below.',
        link: 'https://openrouter.ai/settings/keys',
        linkLabel: 'Go to Keys Page'
    },
    {
        num: 3,
        title: 'Create a New Key',
        desc: 'Click "Create Key", give it a name like "LifeBoat.ai", and hit create. Your key will start with sk-or-v1-...',
    },
    {
        num: 4,
        title: 'Copy & Paste Your Key',
        desc: 'Copy the generated key and paste it into the "OpenRouter API Key" field on the LifeBoat.ai onboarding page. That\'s it!',
    },
];

const faqs = [
    {
        q: 'Is OpenRouter free?',
        a: 'Yes! OpenRouter offers free models (like DeepSeek). LifeBoat.ai uses a free model by default, so you won\'t be charged. If you want premium models (Claude, GPT), you\'ll need to add credits on OpenRouter.'
    },
    {
        q: 'Is my API key safe?',
        a: 'Your key is sent directly to OpenRouter\'s servers for analysis and is never stored on our end. It stays in your browser\'s local storage only.'
    },
    {
        q: 'What if I don\'t provide a key?',
        a: 'LifeBoat.ai will use a shared free-tier key which may be rate-limited during peak hours. For the best experience, use your own key.'
    },
];

const ApiKeyGuide = ({ onBack }) => {
    const [copied, setCopied] = React.useState(false);

    const copyExample = () => {
        navigator.clipboard.writeText('sk-or-v1-xxxxxxxxxxxxxxxxxxxx');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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

            <div className="lb-container relative" style={{ padding: '40px 24px 100px', maxWidth: 720, margin: '0 auto' }}>

                {/* Back button */}
                <motion.button
                    onClick={onBack}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
                        borderRadius: 10, padding: '8px 18px', cursor: 'pointer',
                        color: '#38bdf8', fontSize: 14, fontWeight: 600,
                        marginBottom: 40, fontFamily: 'Outfit'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Upload
                </motion.button>

                {/* Header */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 48 }}
                >
                    <div style={{
                        width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
                        background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Key size={28} color="#38bdf8" />
                    </div>
                    <h1 style={{
                        fontFamily: 'Outfit', fontSize: 32, fontWeight: 800,
                        color: '#f1f5f9', letterSpacing: '-1px', marginBottom: 12
                    }}>
                        How to Get Your API Key
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
                        Follow these simple steps to get your free OpenRouter API key and unlock AI-powered resume analysis.
                    </p>
                </motion.div>

                {/* Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.num}
                            className="lb-card"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * i }}
                            style={{ padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}
                        >
                            <div style={{
                                minWidth: 40, height: 40, borderRadius: 12,
                                background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: '#38bdf8'
                            }}>
                                {s.num}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    fontFamily: 'Outfit', fontSize: 17, fontWeight: 700,
                                    color: '#f1f5f9', marginBottom: 6
                                }}>{s.title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: s.link ? 10 : 0 }}>
                                    {s.desc}
                                </p>
                                {s.link && (
                                    <a
                                        href={s.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            color: '#38bdf8', fontSize: 13, fontWeight: 600,
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {s.linkLabel} <ExternalLink size={13} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Key format example */}
                <motion.div
                    className="lb-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ padding: '20px 24px', marginBottom: 48 }}
                >
                    <p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>
                        Key Format Example
                    </p>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '12px 16px',
                        fontFamily: 'monospace', fontSize: 14, color: '#38bdf8'
                    }}>
                        <span>sk-or-v1-xxxxxxxxxxxxxxxxxxxx</span>
                        <button onClick={copyExample} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                            display: 'flex', alignItems: 'center', gap: 4, fontSize: 12
                        }}>
                            {copied ? <CheckCircle size={14} color="#34d399" /> : <Copy size={14} />}
                        </button>
                    </div>
                </motion.div>

                {/* Security note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        display: 'flex', gap: 14, alignItems: 'flex-start',
                        background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)',
                        borderRadius: 12, padding: '16px 20px', marginBottom: 48
                    }}
                >
                    <Shield size={20} color="#34d399" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                        <p style={{ color: '#34d399', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Your key is safe</p>
                        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
                            Your API key is stored only in your browser's local storage and sent directly to OpenRouter. We never store it on our servers.
                        </p>
                    </div>
                </motion.div>

                {/* FAQ */}
                <h2 style={{
                    fontFamily: 'Outfit', fontSize: 22, fontWeight: 700,
                    color: '#f1f5f9', marginBottom: 20, letterSpacing: '-0.5px'
                }}>
                    Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {faqs.map((f, i) => (
                        <motion.div
                            key={i}
                            className="lb-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 + i * 0.08 }}
                            style={{ padding: '20px 24px' }}
                        >
                            <h4 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
                                {f.q}
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{f.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ApiKeyGuide;
