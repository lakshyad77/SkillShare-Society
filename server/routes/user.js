const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

// GET /api/user/profile
router.get('/profile', auth, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, full_name, username, email, phone_number, apartment_name, block, flat_number, role, skills_offered, availability, latitude, longitude')
            .eq('id', req.user.id)
            .single();

        if (error || !user) return res.status(404).json({ msg: 'User not found' });

        res.json({
            id: user.id,
            fullName: user.full_name,
            username: user.username,
            email: user.email,
            phoneNumber: user.phone_number,
            apartmentName: user.apartment_name,
            block: user.block,
            flatNumber: user.flat_number,
            role: user.role,
            skillsOffered: user.skills_offered,
            availability: user.availability,
            latitude: user.latitude,
            longitude: user.longitude,
        });
    } catch (err) {
        console.error('[Profile Error]', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT /api/user/update
router.put('/update', auth, async (req, res) => {
    const { skillsOffered, availability, apartmentName, block, flatNumber } = req.body;
    try {
        const updates = {};
        if (skillsOffered !== undefined) updates.skills_offered = skillsOffered;
        if (availability !== undefined) updates.availability = availability;
        if (apartmentName) updates.apartment_name = apartmentName;
        if (block) updates.block = block;
        if (flatNumber) updates.flat_number = flatNumber;

        const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ msg: 'Profile updated', user });
    } catch (err) {
        console.error('[Update Error]', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
