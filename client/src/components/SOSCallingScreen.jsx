import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneOff, MapPin, Activity } from 'lucide-react';
import api from '../services/api';

const SOSCallingScreen = ({ onCancel }) => {
    const [seconds, setSeconds] = useState(0);
    const [statusText, setStatusText] = useState('Triangulating Location...');
    const [errorMsg, setErrorMsg] = useState(null);
    const [locationDetails, setLocationDetails] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const triggerAlert = async () => {
            if (!navigator.geolocation) {
                setErrorMsg('Geolocation not supported by your browser.');
                setStatusText('Location Failed');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setStatusText('Broadcasting to Security Hub...');
                    
                    let address = 'Location captured';
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        if (data && data.display_name) {
                            address = data.display_name;
                            setLocationDetails(address);
                        } else {
                            setLocationDetails(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
                        }
                    } catch (e) {
                        setLocationDetails(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
                    }

                    try {
                        await api.post('/safety/sos', { latitude, longitude, address });
                        setStatusText('Alert Broadcasted Successfully');
                    } catch (err) {
                        setErrorMsg('Failed to broadcast alert.');
                    }
                },
                (error) => {
                    setErrorMsg('Location access denied. Cannot send SOS.');
                    setStatusText('Location Failed');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        };
        triggerAlert();
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#ef4444' }}><MapPin size={18} /></span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{statusText}</span>
                    </div>
                    {locationDetails && (
                        <div style={{ marginTop: 4, fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4, fontWeight: 500 }}>
                            <span style={{ color: '#fca5a5', fontWeight: 600 }}>📍 Location:</span> {locationDetails}
                        </div>
                    )}
                </div>
                {errorMsg && <div style={{ color: '#fca5a5', fontSize: 12, textAlign: 'center' }}>{errorMsg}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: '#ef4444' }}><Activity size={18} /></span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Time Elapsed: {seconds}s</span>
                </div>
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
