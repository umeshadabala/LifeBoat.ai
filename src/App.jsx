import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        // ELITE REAL-TIME GEOLOCATION
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    // Use OpenStreetMap / GMaps for reverse geocoding
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const city = data.address.city || data.address.town || data.address.suburb || "Bangalore";
                    const region = data.address.country || "India";
                    setLocation({ city, region });
                } catch (err) {
                    console.warn("Geocoding uplink unstable. Defaulting to detected IP hub.");
                    setLocation({ city: "Bangalore", region: "India" }); // Default to Bangalore as requested
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
                        <div className="flex items-center" style={{ gap: '14px' }}>
                            <div style={{ width: '42px', height: '42px', border: '2px solid #22d3ee', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', fontWeight: '900', fontSize: '20px' }}>L</div>
                            <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff' }}>LifeBoat.ai</h1>
                        </div>
                        <div className="lg:flex hidden" style={{ gap: '12px' }}>
                            <span className="lb-badge accent">REGION_UPLINK: {location.city} • {location.region}</span>
                        </div>
                    </div>

                    <div className="flex items-center" style={{ gap: '24px' }}>
                        <div className="sm:flex hidden items-center" style={{ gap: '10px', color: '#10b981', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} /> UPLINK_STABLE
                        </div>
                    </div>
                </div>
            </nav>

            {isUnlocked && (
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
            )}
        </div>
    );
}

export default App;
