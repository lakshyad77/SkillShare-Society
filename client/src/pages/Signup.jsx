import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS = ['Plumbing', 'Tutor', 'Cooking', 'Cleaning', 'Electrician', 'Painting', 'Driving', 'Carpentry', 'Mechanic', 'Gardening'];
const AVAIL = ['Morning', 'Evening', 'Weekend'];

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState('Detecting...');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedAvail, setSelectedAvail] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '', email: '', username: '', password: '',
        phoneNumber: '', apartmentName: '', block: '', flatNumber: '',
        role: 'Requester', latitude: 12.9716, longitude: 77.5946, // Default: Bangalore
    });

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData(p => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
                    setLocationStatus('✅ Location Captured');
                },
                () => setLocationStatus('⚠️ Using default local results')
            );
        }
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const toggleSkill = (skill) => {
        setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };

    const toggleAvail = (a) => {
        setSelectedAvail(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup({ ...formData, skillsOffered: selectedSkills, availability: selectedAvail });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Signup failed.');
        }
        setLoading(false);
    };

    const showSkills = formData.role === 'Worker' || formData.role === 'Both';
    const labelStyle = { display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 8, fontWeight: 600 };

    return (
        <div className="page-center" style={{ padding: '100px 24px 40px' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-card"
                style={{ padding: '40px', width: '100%', maxWidth: 680, position: 'relative', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🏘️</div>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Join the Society</h2>
                    <p style={{ color: '#64748b', fontSize: 16, marginTop: 6, fontWeight: 500 }}>Build trust with your neighbors</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '14px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Full Name *</label>
                            <input name="fullName" placeholder="Alice Johnson" onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Username *</label>
                            <input name="username" placeholder="alice123" onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Email *</label>
                            <input name="email" type="email" placeholder="alice@email.com" onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Password *</label>
                            <input name="password" type="password" placeholder="••••••••" onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Phone Number *</label>
                            <input name="phoneNumber" placeholder="+91 XXXXX XXXXX" onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Role *</label>
                            <select name="role" onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                                <option value="Requester">Requester (I need help)</option>
                                <option value="Worker">Worker (I offer skills)</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Apartment Name *</label>
                            <input name="apartmentName" placeholder="Green Valley" onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Block *</label>
                            <input name="block" placeholder="A" onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Flat No *</label>
                            <input name="flatNumber" placeholder="304" onChange={handleChange} className="input-field" required />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showSkills && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ ...labelStyle, marginBottom: 12 }}>Skills Offered</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                        {SKILLS.map(skill => (
                                            <button
                                                type="button"
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: 12,
                                                    border: selectedSkills.includes(skill) ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                                    background: selectedSkills.includes(skill) ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                                                    color: selectedSkills.includes(skill) ? '#818cf8' : '#64748b',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ ...labelStyle, marginBottom: 12 }}>Availability</label>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        {AVAIL.map(a => (
                                            <button
                                                type="button"
                                                key={a}
                                                onClick={() => toggleAvail(a)}
                                                style={{
                                                    padding: '8px 20px',
                                                    borderRadius: 12,
                                                    border: selectedAvail.includes(a) ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                                                    background: selectedAvail.includes(a) ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                                                    color: selectedAvail.includes(a) ? '#34d399' : '#64748b',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, fontSize: 14, color: '#64748b', fontWeight: 600 }}>
                        📍 {locationStatus}
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', height: 54, fontSize: 16 }}>
                        {loading ? 'Creating Account...' : 'Join the Community 🚀'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 15, color: '#64748b', fontWeight: 500 }}>
                    Already a member?{' '}
                    <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
