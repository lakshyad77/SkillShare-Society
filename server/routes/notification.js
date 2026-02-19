const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

// GET /api/notification/all
router.get('/all', auth, async (req, res) => {
    try {
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('receiver_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        const formatted = notifications.map(n => ({
            id: n.id,
            message: n.message,
            isRead: n.is_read,
            createdAt: n.created_at,
        }));

        res.json(formatted);
    } catch (err) {
        console.error('[Notifications Error]', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT /api/notification/mark-read/:id
router.put('/mark-read/:id', auth, async (req, res) => {
    try {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', req.params.id)
            .eq('receiver_id', req.user.id);

        res.json({ msg: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
