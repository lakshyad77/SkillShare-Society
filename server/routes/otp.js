const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send SMS via Fast2SMS (free India SMS service)
async function sendSMS(phone, otp) {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey || apiKey === 'your_fast2sms_key_here') {
        // DEV MODE: log OTP to console
        console.log(`📱 OTP for ${phone}: ${otp}  (Add FAST2SMS_API_KEY to .env for real SMS)`);
        return true;
    }

    try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'authorization': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                route: 'otp',
                variables_values: otp,
                numbers: phone.replace(/\D/g, '').slice(-10),
            }),
        });
        const data = await response.json();
        console.log('[SMS]', data);
        return data.return === true;
    } catch (err) {
        console.error('[SMS Error]', err.message);
        return false;
    }
}

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ msg: 'Phone number required' });

    try {
        // Check attempt count (max 3 resends in last 10 mins)
        const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { data: existing } = await supabase
            .from('otp_verifications')
            .select('attempt_count, created_at')
            .eq('phone_number', phoneNumber)
            .gte('created_at', tenMinsAgo)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (existing && existing.attempt_count >= 3) {
            return res.status(429).json({ msg: 'Too many OTP requests. Please wait 10 minutes.' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins

        // Delete old OTPs for this number
        await supabase.from('otp_verifications').delete().eq('phone_number', phoneNumber);

        // Store new OTP
        const { error } = await supabase.from('otp_verifications').insert([{
            phone_number: phoneNumber,
            otp_hash: otpHash,
            expires_at: expiresAt,
            attempt_count: (existing?.attempt_count || 0) + 1,
        }]);

        if (error) throw error;

        // Send SMS
        await sendSMS(phoneNumber, otp);

        res.json({
            success: true,
            msg: 'OTP sent successfully',
            // DEV ONLY: remove in production
            devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
        });

    } catch (err) {
        console.error('[SendOTP Error]', err.message);
        res.status(500).json({ msg: 'Failed to send OTP' });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) return res.status(400).json({ msg: 'Phone and OTP required' });

    try {
        const { data: record, error } = await supabase
            .from('otp_verifications')
            .select('*')
            .eq('phone_number', phoneNumber)
            .eq('is_verified', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !record) return res.status(400).json({ msg: 'OTP not found. Please request a new one.' });

        // Check expiry
        if (new Date() > new Date(record.expires_at)) {
            return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP hash
        const isMatch = await bcrypt.compare(otp, record.otp_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect OTP. Please try again.' });
        }

        // Mark as verified
        await supabase
            .from('otp_verifications')
            .update({ is_verified: true })
            .eq('id', record.id);

        // Mark user phone as verified
        await supabase
            .from('users')
            .update({ phone_verified: true })
            .eq('phone_number', phoneNumber);

        res.json({ success: true, msg: 'Phone number verified successfully!' });

    } catch (err) {
        console.error('[VerifyOTP Error]', err.message);
        res.status(500).json({ msg: 'Failed to verify OTP' });
    }
});

module.exports = router;
