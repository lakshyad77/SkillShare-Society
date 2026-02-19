import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Zap, User, MapPin } from 'lucide-react';

const Chatbot = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your NeighbourMatch AI. Tell me what you need — e.g. "I need a plumber this evening".` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const sentInput = input;
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/request/bot-match', { message: sentInput });
            if (res.data.success) {
                const botMsg = {
                    type: 'bot',
                    text: res.data.matches.length > 0
                        ? `🎯 Search complete! Found **${res.data.matches.length}** neighbor(s) for **${res.data.skill}**:`
                        : `😔 No neighbors found for "${res.data.skill}" nearby right now.`,
                    matches: res.data.matches.slice(0, 4),
                    skill: res.data.skill,
                    time: res.data.time,
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', text: res.data.message }]);
            }
        } catch {
            setMessages(prev => [...prev, { type: 'bot', text: '⚠️ Connection lost.' }]);
        }
        setLoading(false);
    };

    const sendRequest = async (workerId, workerName, skill, time) => {
        try {
            await api.post('/request/send', { workerId, skill, time: time || 'Flexible' });
            setMessages(prev => [...prev, { type: 'bot', text: `✅ Signal sent to **${workerName}**!` }]);
        } catch {
            setMessages(prev => [...prev, { type: 'bot', text: '❌ Broadcast failed.' }]);
        }
    };

    const priorityLabel = (p) => {
        if (p === 1) return { label: 'Same Block', color: '#22c55e' };
        if (p === 2) return { label: 'Same Apartment', color: '#f59e0b' };
        return { label: 'Nearby Area', color: '#94a3b8' };
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: 30, right: 30, width: 60, height: 60,
                    borderRadius: '50%', background: 'var(--primary)', color: 'white',
                    border: 'none', cursor: 'pointer', zIndex: 1000,
                    boxShadow: '0 8px 30px rgba(79, 70, 229, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="glass-card"
                        style={{
                            position: 'fixed', bottom: 100, right: 30, width: 360, height: 500,
                            maxWidth: 'calc(100vw - 60px)', zIndex: 999, display: 'flex',
                            flexDirection: 'column', overflow: 'hidden'
                        }}
                    >
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Bot size={22} />
                            <span style={{ fontWeight: 700 }}>NeighbourMatch AI</span>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                    <div style={{
                                        padding: '10px 14px', borderRadius: '12px', fontSize: 13,
                                        background: msg.type === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                                        color: 'white',
                                    }}>
                                        {msg.text}
                                    </div>

                                    {msg.matches && (
                                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {msg.matches.map((match, i) => {
                                                const p = priorityLabel(match.priority);
                                                return (
                                                    <div key={i} className="glass-card" style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <div style={{ fontSize: 13, fontWeight: 700 }}>{match.user.fullName}</div>
                                                                <div style={{ fontSize: 11, color: '#94a3b8' }}>{match.user.apartmentName}</div>
                                                                <div style={{ fontSize: 10, color: p.color, fontWeight: 800, marginTop: 4 }}>{p.label}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => sendRequest(match.user.id, match.user.fullName, msg.skill, msg.time)}
                                                                className="btn-success" style={{ padding: '4px 8px', fontSize: 11 }}
                                                            >
                                                                Request
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && <div style={{ fontSize: 12, color: '#94a3b8' }}>Searching...</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8 }}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="input-field"
                                placeholder="What do you need?"
                                style={{ flex: 1, padding: '8px 12px' }}
                            />
                            <button onClick={handleSend} className="btn-primary" style={{ padding: '8px 12px' }}>
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
