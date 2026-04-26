import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, User, Activity, Globe, Power, Terminal } from 'lucide-react';
import Onboarding from './components/Onboarding';
import FinancialHub from './components/FinancialHub';
import JobScanner from './components/JobScanner';
import HousingFinder from './components/HousingFinder';
import ResumeSkillBox from './components/ResumeSkillBox';

function App() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [resumeText, setResumeText] = useState("");
    const [intelligence, setIntelligence] = useState(null);
    const [location, setLocation] = useState({ city: "DETECTING", region: "GLOBAL" });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const city = data.address.city || data.address.town || data.address.suburb || "Bangalore";
                    const region = data.address.country || "India";
                    setLocation({ city, region });
                } catch (err) {
                    setLocation({ city: "Bangalore", region: "India" });
                }
            }, () => {
                setLocation({ city: "Bangalore", region: "India" });
            });
        }
    }, []);

    const handleUnlock = (data, rawText) => {
        setResumeText(rawText);
        setIntelligence(data);
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
                    <div className="flex items-center" style={{ gap: '48px' }}>
                        <div className="flex items-center" style={{ gap: '16px' }}>
                            <div style={{ width: '42px', height: '42px', border: '2px solid #22d3ee', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', fontWeight: '900', fontSize: '20px' }}>L</div>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff', fontFamily: 'Outfit' }}>LIFEBOAT.AI</h1>
                        </div>
                        {isUnlocked && (
                            <div className="flex items-center" style={{ gap: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                <span className="lb-badge accent" style={{ background: 'transparent', borderColor: 'rgba(34, 211, 238, 0.1)' }}>
                                    UPLINK: {location.city.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center" style={{ gap: '40px' }}>
                        {isUnlocked && intelligence && (
                            <div className="flex items-center" style={{ gap: '12px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <p className="lb-label" style={{ fontSize: '9px', marginBottom: '2px' }}>OPERATIONAL_NODE</p>
                                    <p style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>{intelligence.name.toUpperCase()}</p>
                                </div>
                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                    <User size={20} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {isUnlocked && (
                <main className="lb-container" style={{ paddingBottom: '120px' }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col" style={{ gap: '48px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px' }}>
                            <FinancialHub />
                            <ResumeSkillBox resumeText={resumeText} externalIntelligence={intelligence} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '64px', alignItems: 'start' }}>
                            <section>
                                <JobScanner />
                            </section>
                            <aside style={{ position: 'sticky', top: '130px' }}>
                                <HousingFinder location={location} />
                            </aside>
                        </div>
                    </motion.div>
                </main>
            )}
        </div>
    );
}

export default App;
