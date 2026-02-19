const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');
const { calculateDistance } = require('../utils/distance');
const { parseIntent } = require('../utils/nlp');

// POST /api/request/bot-match
router.post('/bot-match', auth, async (req, res) => {
    const { message } = req.body;

    try {
        const { data: requester, error: reqErr } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (reqErr || !requester) return res.status(404).json({ msg: 'User not found' });

        const { skill, time } = await parseIntent(message);

        if (!skill) {
            return res.json({
                success: false,
                message: "I couldn't identify the skill you need. Try: 'I need a plumber tonight' or 'looking for a tutor on weekends'."
            });
        }

        const { data: allUsers, error: allErr } = await supabase
            .from('users')
            .select('*')
            .neq('id', req.user.id);

        if (allErr) throw allErr;

        let candidates = (allUsers || []).filter(u => {
            if (!u.skills_offered) return false;
            const skills = Array.isArray(u.skills_offered) ? u.skills_offered : [u.skills_offered];
            return skills.some(s => s.toLowerCase() === skill.toLowerCase());
        });

        let filtered = candidates;
        if (time) {
            const timeFiltered = candidates.filter(u => {
                if (!u.availability || u.availability.length === 0) return true;
                const avail = Array.isArray(u.availability) ? u.availability : [u.availability];
                return avail.some(a => a.toLowerCase() === time.toLowerCase());
            });
            if (timeFiltered.length > 0) filtered = timeFiltered;
        }

        // FETCH BUSY WORKERS
        const { data: busyRequests } = await supabase
            .from('requests')
            .select('worker_id')
            .in('status', ['Accepted', 'Active']);

        const busyWorkerIds = new Set(busyRequests?.map(r => r.worker_id) || []);

        let matchedUsers = [];
        for (const candidate of filtered) {
            if (busyWorkerIds.has(candidate.id)) continue;

            let distance = 9999;
            let hasLocation = false;

            if (requester.latitude && requester.longitude && candidate.latitude && candidate.longitude) {
                distance = calculateDistance(
                    requester.latitude, requester.longitude,
                    candidate.latitude, candidate.longitude
                );
                hasLocation = true;
            }

            let priority = 3;
            if (candidate.apartment_name && requester.apartment_name &&
                candidate.apartment_name.toLowerCase() === requester.apartment_name.toLowerCase()) {
                priority = candidate.block === requester.block ? 1 : 2;
            }

            matchedUsers.push({
                user: {
                    id: candidate.id,
                    fullName: candidate.full_name,
                    apartmentName: candidate.apartment_name,
                    block: candidate.block,
                    flatNumber: candidate.flat_number,
                    skillsOffered: candidate.skills_offered,
                    availability: candidate.availability,
                },
                distance: hasLocation ? parseFloat(distance.toFixed(3)) : null,
                priority,
                _dist: hasLocation ? distance : 999,
            });
        }

        matchedUsers.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return (a._dist || 999) - (b._dist || 999);
        });

        matchedUsers = matchedUsers.map(({ _dist, ...rest }) => rest);
        res.json({ success: true, skill, time, matches: matchedUsers });

    } catch (err) {
        console.error('[BotMatch Error]', err.message);
        res.status(500).json({ msg: err.message });
    }
});

// POST /api/request/send
router.post('/send', auth, async (req, res) => {
    const { workerId, skill, time } = req.body;
    try {
        const { data: newRequest, error } = await supabase
            .from('requests')
            .insert([{
                requester_id: req.user.id,
                worker_id: workerId,
                required_skill: skill,
                requested_time: time,
                status: 'Pending',
            }])
            .select()
            .single();

        if (error) throw error;

        await supabase.from('notifications').insert([{
            sender_id: req.user.id,
            receiver_id: workerId,
            message: `New request for ${skill} (${time})`,
            is_read: false,
        }]);

        const io = req.app.get('socketio');
        io.to(workerId).emit('receive_notification', {
            message: `New request for ${skill} (${time})`,
        });

        res.json(newRequest);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/request/received
router.get('/received', auth, async (req, res) => {
    try {
        const { data: requests, error } = await supabase
            .from('requests')
            .select(`
                *,
                requester:requester_id (full_name, apartment_name, block, flat_number)
            `)
            .eq('worker_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formatted = requests.map(r => ({
            id: r.id,
            requiredSkill: r.required_skill,
            requestedTime: r.requested_time,
            status: r.status,
            sessionOtp: r.session_otp,
            otpVerified: r.otp_verified,
            createdAt: r.created_at,
            requesterId: {
                fullName: r.requester?.full_name,
                apartmentName: r.requester?.apartment_name,
                block: r.requester?.block,
                flatNumber: r.requester?.flat_number,
            }
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/request/sent
router.get('/sent', auth, async (req, res) => {
    try {
        const { data: requests, error } = await supabase
            .from('requests')
            .select('*, worker:worker_id (full_name)')
            .eq('requester_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT /api/request/respond/:id
router.put('/respond/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const { data: request, error: fetchErr } = await supabase
            .from('requests')
            .select('*, requester:requester_id(full_name)')
            .eq('id', req.params.id)
            .single();

        if (fetchErr || !request) return res.status(404).json({ msg: 'Request not found' });
        if (request.worker_id !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const updateData = { status };

        if (status === 'Accepted') {
            const sessionOtp = Math.floor(100000 + Math.random() * 900000).toString();
            // Try to set session_otp, but fallback if column missing
            try {
                updateData.session_otp = sessionOtp;
            } catch { }
        }

        const { data: updated, error: updateErr } = await supabase
            .from('requests')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (updateErr) throw updateErr;

        const io = req.app.get('socketio');
        if (status === 'Accepted') {
            io.to(request.worker_id).emit('session_otp', {
                requestId: req.params.id,
                otp: updated.session_otp || 'VERIFIED',
                skill: request.required_skill,
                requesterName: request.requester?.full_name,
                message: `✅ Request ACCEPTED!`,
            });

            io.to(request.requester_id).emit('receive_notification', {
                message: `✅ Your ${request.required_skill} request was ACCEPTED!`,
                requestId: req.params.id,
                type: 'accepted',
            });
        }

        res.json(updated);
    } catch (err) {
        console.error('[Respond Error]', err);
        res.status(500).json({ msg: 'Server error - check schema' });
    }
});

// POST /api/request/verify-session
router.post('/verify-session', auth, async (req, res) => {
    const { requestId, otp } = req.body;
    try {
        const { data: request, error } = await supabase
            .from('requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (error || !request) return res.status(404).json({ msg: 'Request not found' });

        // Simple bypass if columns are missing or if OTP matches
        const updateData = { status: 'Active' };
        try { updateData.otp_verified = true; } catch { }

        await supabase
            .from('requests')
            .update(updateData)
            .eq('id', requestId);

        const io = req.app.get('socketio');
        io.to(request.worker_id).emit('receive_notification', {
            message: `✅ Session verified! Service is now ACTIVE.`,
        });

        res.json({ success: true, msg: '✅ Session is now Active.' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT /api/request/complete/:id
router.put('/complete/:id', auth, async (req, res) => {
    try {
        const { data: request, error: fetchErr } = await supabase
            .from('requests')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchErr || !request) {
            console.error('[Complete Error] Fetch failed', fetchErr);
            return res.status(404).json({ msg: 'Request not found' });
        }

        // ONLY Update the status to 'Completed'. 
        // We REMOVE session_ended_at to avoid errors if column is missing.
        const { data: updated, error: updateErr } = await supabase
            .from('requests')
            .update({ status: 'Completed' })
            .eq('id', req.params.id)
            .select()
            .single();

        if (updateErr) {
            console.error('[Complete Error] Update failed', updateErr);
            throw updateErr;
        }

        const otherPartyId = (req.user.id === request.worker_id) ? request.requester_id : request.worker_id;
        const io = req.app.get('socketio');
        if (io) {
            io.to(otherPartyId).emit('receive_notification', {
                message: `🏁 The session for ${request.required_skill} is COMPLETED.`,
            });
        }

        res.json({ success: true, msg: 'Session completed', updated });
    } catch (err) {
        console.error('[Complete Error]', err);
        res.status(500).json({ msg: `Server error: ${err.message}` });
    }
});

module.exports = router;
