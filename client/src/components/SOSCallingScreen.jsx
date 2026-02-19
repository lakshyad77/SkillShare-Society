import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneOff, MapPin, Activity } from 'lucide-react';

const SOSCallingScreen = ({ onCancel }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'radial-gradient(circle at center, #7f1d1d 0%, #0f172a 100%)',
            zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontFamily: 'Inter, sans-serif'
        }}>
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute', width: '80vh', height: '80vh',
                    borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', zIndex: -1
                }}
            />

            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        width: 100, height: 100, borderRadius: '50%', background: '#ef4444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px', boxShadow: '0 0 50px rgba(239, 68, 68, 0.5)'
                    }}
                >
                    <ShieldAlert size={50} />
                </motion.div>
                <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2, marginBottom: 8 }}>SIGNAL ACTIVE</h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 600 }}>DISPATCHING ASSISTANCE</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 300 }}>
                {[
                    { icon: <MapPin size={18} />, text: 'Triangulating Location...' },
                    { icon: <Activity size={18} />, text: 'Broadcasting to Security Hub' },
                    { icon: <Activity size={18} />, text: `Time Elapsed: ${seconds}s` },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ color: '#ef4444' }}>{item.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{item.text}</span>
                    </div>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCancel}
                style={{
                    marginTop: 80, width: 70, height: 70, borderRadius: '50%',
                    background: '#1e293b', border: '2px solid rgba(255,255,255,0.1)',
                    color: 'white', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
            >
                <PhoneOff size={28} />
            </motion.button>
            <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>END SIGNAL</p>
        </div>
    );
};

export default SOSCallingScreen;
