const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const {
        fullName, username, email, password, phoneNumber,
        apartmentName, block, flatNumber, role,
        skillsOffered, availability, latitude, longitude,
        emergencyContact
    } = req.body;

    try {
        // Check if user exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) return res.status(400).json({ msg: 'Email already registered' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                full_name: fullName,
                username,
                email,
                password: hashedPassword,
                phone_number: phoneNumber,
                apartment_name: apartmentName,
                block,
                flat_number: flatNumber,
                role: role || 'Requester',
                skills_offered: skillsOffered || [],
                availability: availability || [],
                latitude: latitude || null,
                longitude: longitude || null,
                emergency_contact: emergencyContact || null,
            }])
            .select()
            .single();

        if (error) throw error;

        // Generate token
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: newUser.id,
                fullName: newUser.full_name,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                apartmentName: newUser.apartment_name,
                block: newUser.block,
                flatNumber: newUser.flat_number,
                skillsOffered: newUser.skills_offered,
                availability: newUser.availability,
                emergencyContact: newUser.emergency_contact,
            }
        });

    } catch (err) {
        console.error('[Signup Error]', err.message);
        res.status(500).json({ msg: err.message || 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                role: user.role,
                apartmentName: user.apartment_name,
                block: user.block,
                flatNumber: user.flat_number,
                skillsOffered: user.skills_offered,
                availability: user.availability,
                latitude: user.latitude,
                longitude: user.longitude,
                emergencyContact: user.emergency_contact,
            }
        });

    } catch (err) {
        console.error('[Login Error]', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
