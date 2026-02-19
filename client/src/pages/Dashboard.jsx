import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import Chatbot from '../components/Chatbot';
import SOSButton from '../components/SOSButton';
import AdminSOSPanel from '../components/AdminSOSPanel';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Inbox, Send, Zap, Clock, Shield, CheckCircle2,
    XCircle, MapPin, Key, LayoutGrid, Activity, Star, CheckCircle
} from 'lucide-react';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [requests, setRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('requests');
    const [otpInputs, setOtpInputs] = useState({});
    const [otpMsg, setOtpMsg] = useState({});
    const [sessionOtps, setSessionOtps] = useState({});

    useEffect(() => {
        if (!socket) return;
        socket.on('receive_notification', (data) => {
            setNotifications(prev => [data, ...prev]);
            fetchRequests();
            fetchSentRequests();
        });
        socket.on('session_otp', (data) => {
            setSessionOtps(prev => ({ ...prev, [data.requestId]: data.otp }));
            fetchRequests();
        });
        return () => { socket.off('receive_notification'); socket.off('session_otp'); };
    }, [socket]);

    useEffect(() => {
        if (user) { fetchRequests(); fetchSentRequests(); }
    }, [user]);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/request/received');
            setRequests(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchSentRequests = async () => {
        try {
            const res = await api.get('/request/sent');
            setSentRequests(res.data);
        } catch (err) { console.error(err); }
    };

    const handleRespond = async (id, status) => {
        try {
            await api.put(`/request/respond/${id}`, { status });
            fetchRequests();
        } catch (err) { console.error(err); }
    };

    const handleVerifyOtp = async (requestId) => {
        const otp = otpInputs[requestId];
        if (!otp) return;
        try {
            const res = await api.post('/request/verify-session', { requestId, otp });
            setOtpMsg(prev => ({ ...prev, [requestId]: { text: res.data.msg, ok: true } }));
            fetchSentRequests();
            fetchRequests();
        } catch (err) {
            setOtpMsg(prev => ({ ...prev, [requestId]: { text: err.response?.data?.msg || 'Error', ok: false } }));
        }
    };

    const handleCompleteTask = async (requestId) => {
        if (!window.confirm("Are you sure you want to mark this task as completed?")) return;
        try {
            await api.put(`/request/complete/${requestId}`);
            fetchRequests();
            fetchSentRequests();
        } catch (err) {
            alert('Failed to complete task');
        }
    };

    if (loading) {
        return (
            <div className="page-center" style={{ flexDirection: 'column', gap: 24 }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(79,70,229,0.3)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--text-muted)' }}>Synchronizing Community Data...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const isWorker = user?.role === 'Worker' || user?.role === 'Both';

    return (
        <div className="page-content">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
            >
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
                        Welcome Home, <span className="gradient-text">{user?.fullName?.split(' ')[0]}</span> 👋
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        {user?.role} · {user?.apartmentName}, Block {user?.block} · {user?.flatNumber}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className="pulse-dot" />
                        <span style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>System Live</span>
                    </div>
                    <SOSButton />
                </div>
            </motion.div>

            <div className="grid-3" style={{ marginBottom: 32 }}>
                {[
                    { label: 'Community Impact', value: user?.skillsOffered?.length || 0, icon: <Zap size={20} color="var(--primary)" /> },
                    { label: 'Active Missions', value: requests.filter(r => r.status !== 'Completed').length, icon: <Inbox size={20} color="var(--secondary)" /> },
                    { label: 'System Alerts', value: notifications.length, icon: <Bell size={20} color="var(--warning)" /> },
                ].map((stat, i) => (
                    <motion.div key={i} className="glass-card" style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>{stat.icon}</div>
                            <div style={{ fontSize: 24, fontWeight: 800 }}>{stat.value}</div>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {isWorker && (
                    <button
                        onClick={() => setActiveTab('requests')}
                        className="btn-primary"
                        style={{ background: activeTab === 'requests' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'requests' ? 'white' : 'var(--text-muted)' }}
                    >
                        📥 Incoming
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('sent')}
                    className="btn-primary"
                    style={{ background: activeTab === 'sent' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'sent' ? 'white' : 'var(--text-muted)' }}
                >
                    📤 Outgoing
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className="btn-primary"
                    style={{ background: activeTab === 'notifications' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'notifications' ? 'white' : 'var(--text-muted)' }}
                >
                    🔔 Updates {notifications.length > 0 && <span style={{ background: 'var(--danger)', borderRadius: 10, padding: '2px 6px', fontSize: 10, marginLeft: 4 }}>{notifications.length}</span>}
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'requests' && isWorker && (
                        <div className="grid-2">
                            {requests.length === 0 ? (
                                <div className="glass-card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                                    <Inbox size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                                    <p>No active incoming requests.</p>
                                </div>
                            ) : requests.map((req) => (
                                <ServiceRequestCard
                                    key={req.id} req={req} onRespond={handleRespond}
                                    isWorker={true} otp={sessionOtps[req.id]}
                                    onComplete={() => handleCompleteTask(req.id)}
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === 'sent' && (
                        <div className="grid-2">
                            {sentRequests.length === 0 ? (
                                <div className="glass-card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                                    <Send size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                                    <p>You haven't sent any help requests yet.</p>
                                </div>
                            ) : sentRequests.map((req) => (
                                <ServiceRequestCard
                                    key={req.id} req={req} isWorker={false}
                                    otpValue={otpInputs[req.id]}
                                    onOtpChange={(val) => setOtpInputs(p => ({ ...p, [req.id]: val }))}
                                    onVerify={() => handleVerifyOtp(req.id)}
                                    otpStatus={otpMsg[req.id]}
                                    onComplete={() => handleCompleteTask(req.id)}
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {notifications.length === 0 ? (
                                <div className="glass-card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Bell size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                                    <p>No new updates.</p>
                                </div>
                            ) : notifications.map((n, i) => (
                                <div key={i} className="notif-item">
                                    {n.message}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <Chatbot />
            <AdminSOSPanel />
        </div>
    );
};

const ServiceRequestCard = ({ req, onRespond, isWorker, otp, otpValue, onOtpChange, onVerify, otpStatus, onComplete }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <span className="badge badge-skill" style={{ fontSize: '10px', padding: '4px 8px' }}>
                        {isWorker ? req.requiredSkill : req.required_skill}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: 12, color: 'white' }}>
                        {isWorker ? req.requesterId?.fullName : req.worker?.full_name}
                    </h3>
                </div>
                <span className={`badge badge-${req.status?.toLowerCase()}`} style={{ fontSize: '10px' }}>
                    {req.status}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} color="#818cf8" />
                    <span>{isWorker ? `${req.requesterId?.apartmentName}, Block ${req.requesterId?.block}` : 'Verified Neighbor'}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={14} color="#818cf8" />
                    <span>{isWorker ? req.requestedTime : req.requested_time}</span>
                </div>
            </div>

            {isWorker && req.status === 'Pending' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <button
                        onClick={() => onRespond(req.id, 'Accepted')}
                        className="btn-success"
                        style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => onRespond(req.id, 'Rejected')}
                        className="btn-danger"
                        style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Reject
                    </button>
                </div>
            )}

            {isWorker && (req.status === 'Accepted' || req.status === 'Active') && (otp || req.sessionOtp) && (
                <div style={{ padding: 16, borderRadius: 12, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', marginBottom: 4, textTransform: 'uppercase' }}>Security Key</p>
                    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, color: 'white' }}>
                        {otp || req.sessionOtp}
                    </div>
                    {req.otp_verified && <p style={{ fontSize: 10, color: '#10B981', marginTop: 4, fontWeight: 700 }}>✅ VERIFIED</p>}
                </div>
            )}

            {!isWorker && req.status === 'Accepted' && !req.otp_verified && (
                <div style={{ padding: 16, borderRadius: 12, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>Enter Neighbor's Key:</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            maxLength={6} placeholder="XXXXXX"
                            className="input-field" value={otpValue}
                            onChange={(e) => onOtpChange(e.target.value)}
                            style={{ textAlign: 'center', letterSpacing: 2, fontWeight: 700, flex: 1, height: 40 }}
                        />
                        <button onClick={onVerify} className="btn-primary" style={{ padding: '0 16px', height: 40 }}>
                            <Key size={16} />
                        </button>
                    </div>
                    {otpStatus && <p style={{ fontSize: 11, marginTop: 6, color: otpStatus.ok ? 'var(--success)' : 'var(--danger)' }}>{otpStatus.text}</p>}
                </div>
            )}

            {(req.status === 'Active' || (req.status === 'Accepted' && req.otp_verified)) && (
                <button
                    onClick={() => onComplete(req.id)}
                    className="btn-primary"
                    style={{
                        width: '100%', padding: '12px',
                        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981',
                        color: '#10B981', fontSize: 13, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                >
                    <CheckCircle size={16} /> DONE / COMPLETED
                </button>
            )}
        </motion.div>
    );
};

export default Dashboard;
