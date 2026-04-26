import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Globe, MapPin, Power } from 'lucide-react';
import Onboarding from './components/Onboarding';
import FinancialHub from './components/FinancialHub';
import JobScanner from './components/JobScanner';
import HousingFinder from './components/HousingFinder';
import ResumeSkillBox from './components/ResumeSkillBox';

function App() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [resumeText, setResumeText] = useState("");
    const [backendIntelligence, setBackendIntelligence] = useState(null);
    const [location, setLocation] = useState({ city: "Detecting Nodes...", region: "Global" });

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
                setLocation({ city: "Access Required", region: "Global" });
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
                        <div className="flex items-center" style={{ gap: '16px' }}>
                            <div style={{ width: '42px', height: '42px', border: '2px solid #22d3ee', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', fontWeight: '900', fontSize: '20px', boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)' }}>L</div>
                            <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff', fontFamily: 'Outfit' }}>LIFEBOAT.AI</h1>
                        </div>
                        <div className="lg:flex hidden" style={{ gap: '12px' }}>
                            <span className="lb-badge accent" style={{ background: 'rgba(34, 211, 238, 0.05)', borderColor: 'rgba(34, 211, 238, 0.1)' }}>
                                <MapPin size={12} style={{ marginRight: '6px' }} /> {location.city.toUpperCase()} UPLINK
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center" style={{ gap: '32px' }}>
                        <div className="sm:flex hidden items-center" style={{ gap: '12px', fontSize: '10px', fontWeight: '900', color: '#10b981', letterSpacing: '1px' }}>
                            <Activity size={14} /> STATUS: OPERATIONAL
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.05)' }} />
                        <div className="flex items-center" style={{ gap: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>POWERED BY OPENROUTER</span>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                                <Power size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {isUnlocked && (
                <main className="lb-container" style={{ paddingBottom: '120px' }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col" style={{ gap: '48px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                            <FinancialHub />
                            <ResumeSkillBox resumeText={resumeText} externalIntelligence={backendIntelligence} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
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
