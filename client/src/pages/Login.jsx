import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Check credentials.');
        }
        setLoading(false);
    };

    return (
        <div className="page-center" style={{ background: 'var(--bg-dark)' }}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-card"
                style={{ padding: '48px 40px', width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🔐</div>
                    <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: 'white' }}>Welcome Back</h2>
                    <p style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>Sign in to your community</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '14px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8, height: 54, fontSize: 16 }}>
                        {loading ? 'Signing In...' : 'Sign In →'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 32, fontSize: 15, color: '#64748b', fontWeight: 500 }}>
                    New to SkillShare?{' '}
                    <Link to="/signup" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
