const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

// POST /api/safety/sos — Trigger SOS Alert
router.post('/sos', auth, async (req, res) => {
    const { providerId, latitude, longitude, address } = req.body;
    const userId = req.user.id;

    try {
        // Validate location
        if (!latitude || !longitude) {
            return res.status(400).json({ msg: 'Location is required for SOS alert' });
        }

        // Get user details
        const { data: user } = await supabase
            .from('users')
            .select('full_name, phone_number, apartment_name, block, flat_number')
            .eq('id', userId)
            .single();

        // Get provider details
        let provider = null;
        if (providerId) {
            const { data } = await supabase
                .from('users')
                .select('full_name, phone_number')
                .eq('id', providerId)
                .single();
            provider = data;
        }

        // Insert SOS alert into Supabase
        const { data: alert, error } = await supabase
            .from('sos_alerts')
            .insert([{
                user_id: userId,
                provider_id: providerId || null,
                latitude,
                longitude,
                address: address || 'Location captured',
                status: 'active',
            }])
            .select()
            .single();

        if (error) throw error;

        // Emit real-time alert via Socket.io
        const io = req.app.get('socketio');
        const alertPayload = {
            alertId: alert.id,
            user: {
                id: userId,
                name: user?.full_name || 'Unknown',
                phone: user?.phone_number,
                apartment: user?.apartment_name,
                block: user?.block,
                flat: user?.flat_number,
            },
            provider: provider ? {
                name: provider.full_name,
                phone: provider.phone_number,
            } : null,
            location: { latitude, longitude, address },
            timestamp: alert.created_at,
            status: 'active',
        };

        // Notify all admins and security panels
        io.emit('sosAlertTriggered', alertPayload);
        console.log(`🚨 SOS ALERT from ${user?.full_name} at ${latitude}, ${longitude}`);

        res.json({ success: true, alert: alertPayload, msg: 'SOS alert sent! Help is on the way.' });

    } catch (err) {
        console.error('[SOS Error]', err.message);
        res.status(500).json({ msg: 'Failed to send SOS alert' });
    }
});

// GET /api/safety/alerts — Get all active SOS alerts (Admin)
router.get('/alerts', auth, async (req, res) => {
    try {
        const { data: alerts, error } = await supabase
            .from('sos_alerts')
            .select(`
                *,
                user:user_id (full_name, phone_number, apartment_name, block, flat_number),
                provider:provider_id (full_name, phone_number)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        res.json(alerts);
    } catch (err) {
        console.error('[Alerts Error]', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT /api/safety/resolve/:id — Mark SOS as resolved (Admin)
router.put('/resolve/:id', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sos_alerts')
            .update({ status: 'resolved' })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        const io = req.app.get('socketio');
        io.emit('sosAlertResolved', { alertId: req.params.id });

        res.json({ success: true, alert: data });
    } catch (err) {
        console.error('[Resolve Error]', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
