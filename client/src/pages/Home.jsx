import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="page-center" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 840 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <span style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        color: '#818cf8',
                        padding: '8px 20px',
                        borderRadius: '30px',
                        fontSize: '14px',
                        fontWeight: 700,
                        display: 'inline-block',
                        marginBottom: 32,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        🏘️ The Future of Hyperlocal Sharing
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{
                        fontSize: 'clamp(48px, 8vw, 84px)',
                        fontWeight: 900,
                        lineHeight: 1,
                        marginBottom: 32,
                        color: 'white',
                        letterSpacing: '-2px'
                    }}
                >
                    <span className="gradient-text">Exchange Skills.</span>
                    <br />
                    <span>Build Community.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{ fontSize: 20, color: '#94a3b8', marginBottom: 48, lineHeight: 1.6, maxWidth: 640, margin: '0 auto 48px' }}
                >
                    Connect with verified neighbors for trusted local services. From home repairs to tutoring—your community has it all.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    <Link to="/signup" className="btn-primary" style={{ padding: '18px 40px', fontSize: 18, textDecoration: 'none' }}>
                        Get Started Today →
                    </Link>
                    <Link to="/login" style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '18px 40px',
                        borderRadius: 12,
                        fontSize: 18,
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: '0.2s',
                    }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        Sign In
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
