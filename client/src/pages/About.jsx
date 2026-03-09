import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Home, Wrench, BookOpen, ChefHat, Monitor, Sparkles, MapPin, Users, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

const About = () => {
    const [botInput, setBotInput] = useState('');
    const [botMessages, setBotMessages] = useState([
        { type: 'bot', text: 'Hi neighbour! What kind of help do you need today?' }
    ]);

    const handleBotSubmit = (e) => {
        e.preventDefault();
        if (!botInput.trim()) return;

        const newMessages = [...botMessages, { type: 'user', text: botInput }];
        setBotMessages(newMessages);
        setBotInput('');

        setTimeout(() => {
            setBotMessages([
                ...newMessages,
                { type: 'bot', text: `Searching for nearby neighbours who can help with "${botInput}"...` }
            ]);
        }, 600);
        
        setTimeout(() => {
            setBotMessages(prev => [
                ...prev,
                { type: 'bot', text: '✅ Found 3 matches in your apartment block and 5 within 1km. Check your dashboard to connect!' }
            ]);
        }, 2000);
    };

    const skills = [
        { name: 'Repairs', icon: <Wrench size={32} />, color: '#ef4444' },
        { name: 'Teaching', icon: <BookOpen size={32} />, color: '#3b82f6' },
        { name: 'Cooking', icon: <ChefHat size={32} />, color: '#f59e0b' },
        { name: 'Tech Help', icon: <Monitor size={32} />, color: '#8b5cf6' },
        { name: 'Cleaning', icon: <Sparkles size={32} />, color: '#10b981' },
    ];

    const steps = [
        { title: 'Sign Up', desc: 'Join with your apartment details to find locals.', icon: <Home size={24} /> },
        { title: 'List or Request', desc: 'Offer your skills or post a help request.', icon: <Sparkles size={24} /> },
        { title: 'Get Matched', desc: 'Our AI finds the closest neighbours for you.', icon: <Bot size={24} /> },
        { title: 'Connect', desc: 'Chat, solve the problem and build trust!', icon: <HeartHandshake size={24} /> },
    ];

    const stories = [
        { name: 'Priya K.', apt: 'Block A, Skyline Apts', text: 'Found a math tutor for my son in my own building. So convenient and safe!' },
        { name: 'Rahul S.', apt: 'Block C, Green Valley', text: 'My laptop crashed right before a meeting. A neighbour 2 doors down fixed it in 10 mins.' },
        { name: 'Anita B.', apt: 'Oakwood Residences', text: 'I trade my homemade meals for gardening help. It truly feels like a community here.' }
    ];

    return (
        <div style={{ paddingBottom: '100px', overflowX: 'hidden' }}>
            {/* 1. Hero Section */}
            <section style={{ 
                minHeight: '80vh', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                padding: '100px 20px', position: 'relative'
            }}>
                <div style={{
                    position: 'absolute', top: -100, width: 600, height: 600,
                    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                    zIndex: -1
                }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span style={{
                        background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
                        color: '#818cf8', padding: '8px 20px', borderRadius: '30px', fontSize: '14px',
                        fontWeight: 700, display: 'inline-block', marginBottom: 24, letterSpacing: 1
                    }}>
                        NEIGHBOURS HELPING NEIGHBOURS
                    </span>
                    <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
                        Share Skills. <br/>
                        <span className="gradient-text">Build Community.</span>
                    </h1>
                    <p style={{ fontSize: 20, color: '#94a3b8', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6 }}>
                        A hyperlocal skill exchange platform where residents in the same complex or nearby localities can offer and request everyday services.
                    </p>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/signup" className="btn-primary" style={{ padding: '16px 36px', fontSize: 18, textDecoration: 'none' }}>
                            Join Your Community
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* 2. AI Assistant Preview */}
            <section style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Meet NeighbourMatch Bot 🤖</h2>
                    <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                        Just type what you need. Our smart AI instantly finds neighbours with the right skills who are available exactly when you need them.
                    </p>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    style={{
                        background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 24, overflow: 'hidden', maxWidth: 700, margin: '0 auto',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)'
                    }}
                >
                    <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={24} color="white" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>NeighbourMatch AI</h3>
                                <p style={{ fontSize: 12, color: '#10b981', margin: 0 }}>Online</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ padding: 24, height: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {botMessages.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                                alignSelf: m.type === 'bot' ? 'flex-start' : 'flex-end',
                                background: m.type === 'bot' ? 'rgba(255,255,255,0.05)' : '#6366f1',
                                padding: '12px 18px', borderRadius: 18, borderBottomLeftRadius: m.type === 'bot' ? 4 : 18,
                                borderBottomRightRadius: m.type === 'user' ? 4 : 18, maxWidth: '80%', color: 'white',
                                fontSize: 15, lineHeight: 1.5
                            }}>
                                {m.text}
                            </motion.div>
                        ))}
                    </div>

                    <form onSubmit={handleBotSubmit} style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 12, background: 'rgba(0,0,0,0.2)' }}>
                        <input
                            type="text" value={botInput} onChange={e => setBotInput(e.target.value)}
                            placeholder="Try: I need help fixing a leaking sink..."
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '14px 20px', borderRadius: 30, color: 'white', outline: 'none'
                            }}
                        />
                        <button type="submit" style={{
                            background: '#6366f1', border: 'none', width: 48, height: 48,
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white'
                        }}>
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </motion.div>
            </section>

            {/* 3. Skills Categories */}
            <section style={{ padding: '80px 20px', background: 'rgba(15, 23, 42, 0.5)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Everyday Services at Your Doorstep</h2>
                        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                            Whatever you need, someone nearby knows how to do it.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {skills.map((skill, i) => (
                            <motion.div key={i} whileHover={{ y: -10 }} style={{
                                width: 180, padding: 32, background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
                            }}>
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${skill.color}20`, color: skill.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {skill.icon}
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{skill.name}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Nearby Helpers Concept */}
            <section style={{ padding: '100px 20px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>
                            Hyperlocal Connection.<br/><span style={{ color: '#10b981' }}>Within 1 Km Radius.</span>
                        </h2>
                        <p style={{ fontSize: 18, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
                            Trust starts locally. We match you with helpers living in your very own apartment building first, before expanding the search to a 1 km radius.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {['Same Apartment Block Priority', 'Verified Local Residents', 'Faster Response Times'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, fontWeight: 600 }}>
                                    <ShieldCheck color="#10b981" /> {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ position: 'relative' }}>
                        <div style={{ width: '100%', aspectRatio: '1/1', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', width: 280, height: 280, border: '2px dashed rgba(16,185,129,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 60, height: 60, background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(16,185,129,0.5)', zIndex: 10 }}>
                                    <Home size={30} color="white" />
                                </div>
                                {/* Surrounding nodes */}
                                {[0, 72, 144, 216, 288].map((deg, i) => (
                                    <div key={i} style={{
                                        position: 'absolute', width: 40, height: 40, background: 'rgba(30, 41, 59, 0.9)', border: '1px solid #10b981',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transform: `rotate(${deg}deg) translate(140px) rotate(-${deg}deg)`
                                    }}>
                                        <Users size={20} color="#10b981" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 5. How it Works */}
            <section style={{ padding: '100px 20px', background: 'rgba(15, 23, 42, 0.5)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>How the Platform Works</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
                        {steps.map((step, i) => (
                            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                                <div style={{ width: 64, height: 64, margin: '0 auto 20px', borderRadius: 20, background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {step.icon}
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{i+1}. {step.title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Community Stories */}
            <section style={{ padding: '100px 20px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Community Stories</h2>
                    <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                        Real stories of neighbours helping each other out.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                    {stories.map((s, i) => (
                        <div key={i} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', gap: 4, color: '#f59e0b', marginBottom: 16 }}>
                                {[1,2,3,4,5].map(n => <span key={n}>★</span>)}
                            </div>
                            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'white', marginBottom: 24 }}>"{s.text}"</p>
                            <div>
                                <h4 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{s.name}</h4>
                                <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>📍 {s.apt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. Call to Action */}
            <section style={{ padding: '80px 20px', textAlign: 'center' }}>
                <motion.div whileHover={{ scale: 1.02 }} style={{
                    maxWidth: 800, margin: '0 auto', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    padding: '64px 32px', borderRadius: 32, boxShadow: '0 20px 50px rgba(99,102,241,0.4)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 24 }}>Ready to meet your neighbours?</h2>
                        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
                            Join SkillShare Society today and become part of a self-reliant, friendly, and thriving community ecosystem.
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/signup" className="btn-primary" style={{ background: 'white', color: '#4f46e5', padding: '16px 40px', fontSize: 18, textDecoration: 'none' }}>
                                Start Sharing Skills
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
