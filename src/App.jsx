import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, User } from 'lucide-react';
import Onboarding from './components/Onboarding';
import FinancialHub from './components/FinancialHub';
import JobScanner from './components/JobScanner';
import HousingFinder from './components/HousingFinder';
import ResumeSkillBox from './components/ResumeSkillBox';

function App() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [resumeText, setResumeText] = useState('');
    const [intelligence, setIntelligence] = useState(null);
    const [location, setLocation] = useState({ city: 'Bangalore', region: 'India' });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await response.json();
                    const city = data.address.city || data.address.town || data.address.suburb || 'Bangalore';
                    const region = data.address.country || 'India';
                    setLocation({ city, region });
                } catch {
                    setLocation({ city: 'Bangalore', region: 'India' });
                }
            }, () => setLocation({ city: 'Bangalore', region: 'India' }));
        }
    }, []);

    const handleUnlock = (data, rawText) => {
        setResumeText(rawText || '');
        setIntelligence(data);
        setIsUnlocked(true);
    };

    // Build skills list from intelligence for job scanning
    const skillsForJobs = intelligence?.skills ||
        (intelligence?.technical_skills || []).map(s => s.name);

    const candidateName = intelligence?.name || null;

    return (
        <div className="lb-app">
            <AnimatePresence>
                {!isUnlocked && <Onboarding onComplete={handleUnlock} />}
            </AnimatePresence>

            {/* ── HEADER ── */}
            <nav className="lb-header">
                <div className="lb-container flex items-center justify-between w-full">
                    {/* Logo + location */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div style={{
                                width: 38, height: 38,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))',
                                border: '1px solid rgba(56,189,248,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#38bdf8', fontFamily: 'Outfit', fontWeight: 800, fontSize: 18
                            }}>L</div>
                            <span style={{
                                fontFamily: 'Outfit', fontSize: 20, fontWeight: 800,
                                letterSpacing: '-0.8px', color: '#f1f5f9'
                            }}>LifeBoat<span style={{ color: '#38bdf8' }}>.ai</span></span>
                        </div>

                        {isUnlocked && (
                            <div className="flex items-center gap-2">
                                <span className="lb-dot live" />
                                <span className="lb-badge accent">
                                    <MapPin size={11} /> {location.city}, {location.region}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Candidate identity */}
                    {isUnlocked && candidateName && (
                        <div className="flex items-center gap-3">
                            <div style={{ textAlign: 'right' }}>
                                <p className="lb-label" style={{ marginBottom: 2 }}>Candidate</p>
                                <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Outfit' }}>
                                    {candidateName}
                                </p>
                            </div>
                            <div style={{
                                width: 38, height: 38, borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.12))',
                                border: '1px solid rgba(56,189,248,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#38bdf8'
                            }}>
                                <User size={18} />
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* ── MAIN DASHBOARD ── */}
            {isUnlocked && (
                <main className="lb-container" style={{ paddingTop: 40, paddingBottom: 120 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        className="flex flex-col gap-12"
                    >
                        {/* Row 1: Financial + Profile */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                            gap: 32
                        }}>
                            <FinancialHub />
                            <ResumeSkillBox
                                resumeText={resumeText}
                                externalIntelligence={intelligence}
                            />
                        </div>

                        {/* Row 2: Jobs + Housing */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1fr) 360px',
                            gap: 32,
                            alignItems: 'start'
                        }}>
                            <JobScanner
                                skills={skillsForJobs}
                                primaryRole={intelligence?.primary_role}
                                candidateProfile={intelligence}
                                resumeText={resumeText}
                            />
                            <div style={{ position: 'sticky', top: 96 }}>
                                <HousingFinder location={location} />
                            </div>
                        </div>
                    </motion.div>
                </main>
            )}
        </div>
    );
}

export default App;
