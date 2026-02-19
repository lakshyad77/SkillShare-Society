import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Zap } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <Zap size={24} fill="#818cf8" color="#818cf8" />
                <span>SkillShare Society</span>
            </Link>

            <div className="navbar-links">
                {user ? (
                    <>
                        <span style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 600 }}>
                            👋 {user.fullName?.split(' ')[0] || user.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.2)',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 700,
                                transition: '0.2s',
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-link">Login</Link>
                        <Link
                            to="/signup"
                            className="btn-primary"
                            style={{
                                padding: '10px 24px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                textDecoration: 'none'
                            }}
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
