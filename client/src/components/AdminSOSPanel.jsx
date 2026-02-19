import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import api from '../services/api';

const AdminSOSPanel = () => {
    const [alerts, setAlerts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newAlert, setNewAlert] = useState(false);

    useEffect(() => {
        // Connect to socket for real-time SOS
        const socket = io('http://localhost:5000');
        socket.emit('join_admin');

        socket.on('sosAlertTriggered', (alert) => {
            setAlerts(prev => [alert, ...prev]);
            setNewAlert(true);
            setIsOpen(true);
            // Browser notification
            if (Notification.permission === 'granted') {
                new Notification('🚨 SOS ALERT!', {
                    body: `${alert.user.name} needs help at ${alert.location.address}`,
                    icon: '/favicon.ico',
                });
            }
        });

        socket.on('sosAlertResolved', ({ alertId }) => {
            setAlerts(prev => prev.map(a =>
                a.alertId === alertId ? { ...a, status: 'resolved' } : a
            ));
        });

        // Load existing active alerts
        api.get('/safety/alerts')
            .then(res => setAlerts(res.data))
            .catch(() => { });

        // Request notification permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => socket.disconnect();
    }, []);

    const resolveAlert = async (alertId) => {
        try {
            await api.put(`/safety/resolve/${alertId}`);
            setAlerts(prev => prev.map(a =>
                a.alertId === alertId || a.id === alertId
                    ? { ...a, status: 'resolved' }
                    : a
            ));
        } catch (err) {
            console.error('Error resolving alert', err);
        }
    };

    const activeCount = alerts.filter(a => a.status === 'active').length;

    return (
        <>
            {/* Floating SOS Monitor Button */}
            <motion.button
                onClick={() => { setIsOpen(true); setNewAlert(false); }}
                whileHover={{ scale: 1.05 }}
                style={{
                    position: 'fixed', bottom: 100, right: 24,
                    background: activeCount > 0 ? '#dc2626' : '#1e293b',
                    border: activeCount > 0 ? '2px solid #fca5a5' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '10px 16px',
                    color: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                    zIndex: 100,
                    boxShadow: activeCount > 0 ? '0 0 20px rgba(220,38,38,0.4)' : 'none',
                }}
            >
                🛡️ SOS Monitor
                {activeCount > 0 && (
                    <span style={{
                        background: 'white', color: '#dc2626',
                        borderRadius: '50%', width: 20, height: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                    }}>
                        {activeCount}
                    </span>
                )}
            </motion.button>

            {/* SOS Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}
                        style={{
                            position: 'fixed', top: 0, right: 0, bottom: 0,
                            width: Math.min(420, window.innerWidth),
                            background: '#0f0f23',
                            borderLeft: '1px solid rgba(255,255,255,0.1)',
                            zIndex: 200, display: 'flex', flexDirection: 'column',
                            overflowY: 'auto',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: '#1a0000', position: 'sticky', top: 0, zIndex: 1,
                        }}>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fca5a5' }}>
                                    🚨 SOS Alert Monitor
                                </h2>
                                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                                    {activeCount > 0 ? `${activeCount} ACTIVE EMERGENCY${activeCount > 1 ? 'S' : ''}` : 'No active alerts'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20 }}
                            >✕</button>
                        </div>

                        {/* Alerts List */}
                        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {alerts.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>
                                    <div style={{ fontSize: 48 }}>🛡️</div>
                                    <p style={{ marginTop: 12 }}>All clear. No SOS alerts.</p>
                                </div>
                            ) : (
                                alerts.map((alert, i) => (
                                    <motion.div
                                        key={alert.alertId || alert.id || i}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            padding: 16, borderRadius: 12,
                                            background: alert.status === 'active'
                                                ? 'rgba(220,38,38,0.15)'
                                                : 'rgba(22,163,74,0.1)',
                                            border: `1px solid ${alert.status === 'active' ? 'rgba(220,38,38,0.4)' : 'rgba(22,163,74,0.3)'}`,
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                    <span style={{
                                                        width: 8, height: 8, borderRadius: '50%',
                                                        background: alert.status === 'active' ? '#dc2626' : '#16a34a',
                                                        display: 'inline-block',
                                                        boxShadow: alert.status === 'active' ? '0 0 8px #dc2626' : 'none',
                                                    }} />
                                                    <span style={{ fontWeight: 700, color: alert.status === 'active' ? '#fca5a5' : '#4ade80', fontSize: 15 }}>
                                                        {alert.status === 'active' ? '⚡ ACTIVE' : '✅ RESOLVED'}
                                                    </span>
                                                </div>
                                                <p style={{ color: 'white', fontWeight: 600, marginBottom: 4 }}>
                                                    👤 {alert.user?.name || alert.user?.full_name || 'Unknown User'}
                                                </p>
                                                <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>
                                                    📞 {alert.user?.phone || 'N/A'}
                                                </p>
                                                <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>
                                                    🏠 {alert.user?.apartment || 'N/A'}, Block {alert.user?.block}, Flat {alert.user?.flat}
                                                </p>
                                                {alert.provider && (
                                                    <p style={{ color: '#f59e0b', fontSize: 12, marginBottom: 4 }}>
                                                        🔧 Provider: {alert.provider.name}
                                                    </p>
                                                )}
                                                <p style={{ color: '#64748b', fontSize: 11, marginBottom: 8 }}>
                                                    📍 {typeof alert.location === 'object'
                                                        ? (alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`)
                                                        : 'Location unavailable'}
                                                </p>
                                                <a
                                                    href={`https://maps.google.com/?q=${alert.location?.latitude},${alert.location?.longitude}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ color: '#818cf8', fontSize: 12, textDecoration: 'none' }}
                                                >
                                                    🗺️ View on Maps →
                                                </a>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                            {alert.status === 'active' && (
                                                <button
                                                    onClick={() => resolveAlert(alert.alertId || alert.id)}
                                                    style={{
                                                        padding: '7px 14px', borderRadius: 8,
                                                        background: '#16a34a', border: 'none',
                                                        color: 'white', cursor: 'pointer',
                                                        fontSize: 12, fontWeight: 600,
                                                        fontFamily: 'Inter, sans-serif',
                                                    }}
                                                >
                                                    ✅ Mark Resolved
                                                </button>
                                            )}
                                            <p style={{ fontSize: 11, color: '#475569', alignSelf: 'center' }}>
                                                {new Date(alert.timestamp || alert.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSOSPanel;
