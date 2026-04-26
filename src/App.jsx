import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Bell, Zap, Activity } from 'lucide-react';
import Onboarding from './components/Onboarding';
import FinancialHub from './components/FinancialHub';
import JobScanner from './components/JobScanner';
import HousingFinder from './components/HousingFinder';
import ResumeSkillBox from './components/ResumeSkillBox';

function App() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [resumeText, setResumeText] = useState("");
    const [backendIntelligence, setBackendIntelligence] = useState(null);
    const [location, setLocation] = useState({ city: "Detecting...", region: "Global" });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                // Reverse Geocoding would happen here with GMaps key
                setLocation({ city: "San Francisco", region: "USA" });
            });
        }
    }, []);

    const handleUnlock = (intelligence, rawText) => {
        setResumeText(rawText);
        setBackendIntelligence(intelligence);
        setIsUnlocked(true);
    };

    return (
        <div className="lb-app">
            <AnimatePresence>
                {!isUnlocked && (
                    <Onboarding onComplete={handleUnlock} />
                )}
            </AnimatePresence>

            <nav className="lb-header">
                <div className="lb-container flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '40px' }}>
                        <div className="flex items-center" style={{ gap: '14px' }}>
                            <div style={{ width: '42px', height: '42px', border: '2px solid #22d3ee', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', fontWeight: '900', fontSize: '20px' }}>L</div>
                            <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff' }}>LifeBoat.ai</h1>
                        </div>
                        <div className="lg:flex hidden" style={{ gap: '12px' }}>
                            <span className="lb-badge accent">UPLINK: {location.city}</span>
                        </div>
                    </div>

                    <div className="flex items-center" style={{ gap: '24px' }}>
                        <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '11px',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '900',
                            fontSize: '11px',
                            color: '#94a3b8'
                        }}>
                            USER
                        </div>
                    </div>
                </div>
            </nav>

            <main className="lb-container" style={{ paddingTop: '64px', paddingBottom: '120px' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col" style={{ gap: '64px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px' }}>
                        <FinancialHub />
                        <ResumeSkillBox resumeText={resumeText} externalIntelligence={backendIntelligence} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
                        <section>
                            <JobScanner />
                        </section>
                        <aside>
                            <HousingFinder location={location} />
                        </aside>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

export default App;
