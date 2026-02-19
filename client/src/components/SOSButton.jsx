import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import SOSCallingScreen from './SOSCallingScreen';

const SOSButton = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isCalling, setIsCalling] = useState(false);

    const triggerSOS = () => {
        setIsCalling(true);
        setShowConfirm(false);
    };

    if (isCalling) {
        return <SOSCallingScreen onCancel={() => setIsCalling(false)} />;
    }

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirm(true)}
                style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.39)',
                    fontSize: 14,
                }}
            >
                <ShieldAlert size={18} />
                EMERGENCY SOS
            </motion.button>

            <AnimatePresence>
                {showConfirm && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="glass-card"
                            style={{ padding: 40, maxWidth: 440, width: '90%', textAlign: 'center', border: '1px solid rgba(220, 38, 38, 0.3)' }}
                        >
                            <div style={{
                                width: 70, height: 70, borderRadius: '50%', background: 'rgba(220, 38, 38, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                                color: '#ef4444'
                            }}>
                                <ShieldAlert size={40} />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Confirm SOS Signal?</h2>
                            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
                                An emergency signal will be broadcasted to all nearby security personnel and the admin dashboard.
                            </p>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="btn-primary"
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={triggerSOS}
                                    className="btn-primary"
                                    style={{ flex: 1, background: '#dc2626' }}
                                >
                                    Broadcast SOS
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SOSButton;
