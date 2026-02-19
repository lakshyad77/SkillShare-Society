import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const OTPVerification = ({ phoneNumber, onVerified }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState('idle'); // idle | sending | sent | verifying | verified | error
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [devOtp, setDevOtp] = useState('');
    const inputRefs = useRef([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const sendOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setMessage('Please enter a valid phone number first.');
            setStatus('error');
            return;
        }
        setStatus('sending');
        setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/send-otp', { phoneNumber });
            setStatus('sent');
            setCountdown(60);
            setMessage('OTP sent! Check your phone.');
            if (res.data.devOtp) {
                setDevOtp(res.data.devOtp);
                setMessage(`📱 DEV MODE — Your OTP: ${res.data.devOtp}`);
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.msg || 'Failed to send OTP.');
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setMessage('Please enter all 6 digits.');
            return;
        }
        setStatus('verifying');
        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', {
                phoneNumber,
                otp: otpString,
            });
            setStatus('verified');
            setMessage('✅ Phone verified successfully!');
            if (onVerified) onVerified();
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.msg || 'Invalid OTP. Try again.');
        }
    };

    if (status === 'verified') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    padding: '12px 16px', borderRadius: 8, textAlign: 'center',
                    background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.4)',
                    color: '#4ade80', fontSize: 14, fontWeight: 600,
                }}
            >
                ✅ Phone Number Verified!
            </motion.div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Send OTP Button */}
            {status !== 'sent' && status !== 'verifying' && (
                <motion.button
                    type="button"
                    onClick={sendOTP}
                    disabled={status === 'sending' || countdown > 0}
                    whileHover={{ scale: 1.02 }}
                    style={{
                        padding: '10px 16px', borderRadius: 8,
                        background: countdown > 0 ? 'rgba(255,255,255,0.05)' : 'rgba(79,70,229,0.2)',
                        border: '1px solid rgba(79,70,229,0.4)',
                        color: countdown > 0 ? '#64748b' : '#a5b4fc',
                        cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                    }}
                >
                    {status === 'sending' ? '⏳ Sending...' :
                        countdown > 0 ? `Resend OTP in ${countdown}s` : '📱 Send OTP'}
                </motion.button>
            )}

            {/* OTP Input */}
            <AnimatePresence>
                {(status === 'sent' || status === 'verifying' || status === 'error') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 10 }}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => inputRefs.current[i] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    style={{
                                        width: 40, height: 48, textAlign: 'center',
                                        fontSize: 20, fontWeight: 700,
                                        background: 'rgba(255,255,255,0.05)',
                                        border: digit ? '2px solid #4F46E5' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8, color: 'white',
                                        fontFamily: 'Inter, sans-serif',
                                        outline: 'none',
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={status === 'verifying'}
                            style={{
                                width: '100%', padding: '10px', borderRadius: 8,
                                background: '#4F46E5', border: 'none',
                                color: 'white', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
                            }}
                        >
                            {status === 'verifying' ? '⏳ Verifying...' : '✅ Verify OTP'}
                        </button>

                        {countdown > 0 && (
                            <button
                                type="button"
                                onClick={sendOTP}
                                disabled={countdown > 0}
                                style={{
                                    background: 'none', border: 'none', color: '#64748b',
                                    cursor: 'not-allowed', fontSize: 12, marginTop: 6,
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                Resend in {countdown}s
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status message */}
            {message && (
                <p style={{
                    fontSize: 12, textAlign: 'center',
                    color: status === 'error' ? '#f87171' : status === 'verified' ? '#4ade80' : '#fbbf24',
                }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default OTPVerification;
