/**
 * Seed Script — Adds 20 demo users to Supabase
 * Run with: node seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 20 realistic users with varied skills (all in same apartment = Green Valley)
const demoUsers = [
    { fullName: 'Ravi Kumar', username: 'ravi_k', email: 'ravi@demo.com', role: 'Worker', skills: ['Plumbing', 'Electrician'], avail: ['Morning', 'Evening'], block: 'A', flat: '101', lat: 12.9716, lng: 77.5946 },
    { fullName: 'Priya Sharma', username: 'priya_s', email: 'priya@demo.com', role: 'Worker', skills: ['Tutor'], avail: ['Evening', 'Weekend'], block: 'A', flat: '102', lat: 12.9717, lng: 77.5947 },
    { fullName: 'Arjun Mehta', username: 'arjun_m', email: 'arjun@demo.com', role: 'Worker', skills: ['Carpentry', 'Painting'], avail: ['Weekend'], block: 'A', flat: '201', lat: 12.9718, lng: 77.5948 },
    { fullName: 'Sunita Rao', username: 'sunita_r', email: 'sunita@demo.com', role: 'Worker', skills: ['Cooking'], avail: ['Morning'], block: 'A', flat: '302', lat: 12.9719, lng: 77.5949 },
    { fullName: 'Karthik Nair', username: 'karthik_n', email: 'karthik@demo.com', role: 'Worker', skills: ['Electrician'], avail: ['Morning', 'Weekend'], block: 'B', flat: '101', lat: 12.9720, lng: 77.5950 },
    { fullName: 'Deepa Iyer', username: 'deepa_i', email: 'deepa@demo.com', role: 'Worker', skills: ['Tutor', 'Cooking'], avail: ['Evening', 'Weekend'], block: 'B', flat: '202', lat: 12.9721, lng: 77.5951 },
    { fullName: 'Suresh Patil', username: 'suresh_p', email: 'suresh@demo.com', role: 'Worker', skills: ['Driving'], avail: ['Morning', 'Evening'], block: 'B', flat: '303', lat: 12.9722, lng: 77.5952 },
    { fullName: 'Ananya Singh', username: 'ananya_s', email: 'ananya@demo.com', role: 'Worker', skills: ['Painting', 'Cleaning'], avail: ['Weekend'], block: 'B', flat: '401', lat: 12.9723, lng: 77.5953 },
    { fullName: 'Mohan Das', username: 'mohan_d', email: 'mohan@demo.com', role: 'Worker', skills: ['Plumbing'], avail: ['Morning', 'Evening', 'Weekend'], block: 'C', flat: '101', lat: 12.9714, lng: 77.5944 },
    { fullName: 'Lakshmi Devi', username: 'lakshmi_d', email: 'lakshmi@demo.com', role: 'Worker', skills: ['Cooking', 'Cleaning'], avail: ['Morning'], block: 'C', flat: '205', lat: 12.9715, lng: 77.5943 },
    { fullName: 'Vikram Nair', username: 'vikram_n', email: 'vikram@demo.com', role: 'Worker', skills: ['Carpentry'], avail: ['Evening', 'Weekend'], block: 'C', flat: '301', lat: 12.9713, lng: 77.5942 },
    { fullName: 'Kavitha Menon', username: 'kavitha_m', email: 'kavitha@demo.com', role: 'Worker', skills: ['Tutor'], avail: ['Weekend'], block: 'C', flat: '402', lat: 12.9712, lng: 77.5941 },
    { fullName: 'Ramesh Gupta', username: 'ramesh_g', email: 'ramesh@demo.com', role: 'Worker', skills: ['Electrician', 'Carpentry'], avail: ['Morning'], block: 'D', flat: '103', lat: 12.9711, lng: 77.5940 },
    { fullName: 'Nisha Patel', username: 'nisha_p', email: 'nisha@demo.com', role: 'Worker', skills: ['Gardening', 'Cooking'], avail: ['Morning', 'Weekend'], block: 'D', flat: '201', lat: 12.9710, lng: 77.5939 },
    { fullName: 'Sanjay Verma', username: 'sanjay_v', email: 'sanjay@demo.com', role: 'Worker', skills: ['Driving', 'Carpentry'], avail: ['Evening'], block: 'D', flat: '305', lat: 12.9709, lng: 77.5938 },
    { fullName: 'Meena Krishnan', username: 'meena_k', email: 'meena@demo.com', role: 'Worker', skills: ['Cleaning'], avail: ['Morning', 'Evening'], block: 'D', flat: '401', lat: 12.9708, lng: 77.5937 },
    { fullName: 'Arun Pillai', username: 'arun_p', email: 'arun@demo.com', role: 'Worker', skills: ['Plumbing', 'Painting'], avail: ['Weekend'], block: 'E', flat: '101', lat: 12.9707, lng: 77.5936 },
    { fullName: 'Pooja Reddy', username: 'pooja_r', email: 'pooja@demo.com', role: 'Worker', skills: ['Tutor', 'Gardening'], avail: ['Evening', 'Weekend'], block: 'E', flat: '204', lat: 12.9706, lng: 77.5935 },
    { fullName: 'Girish Hegde', username: 'girish_h', email: 'girish@demo.com', role: 'Worker', skills: ['Electrician', 'Driving'], avail: ['Morning', 'Weekend'], block: 'E', flat: '302', lat: 12.9705, lng: 77.5934 },
    { fullName: 'Radha Bhat', username: 'radha_b', email: 'radha@demo.com', role: 'Both', skills: ['Cooking', 'Tutor'], avail: ['Morning', 'Evening', 'Weekend'], block: 'E', flat: '403', lat: 12.9704, lng: 77.5933 },
];

async function seed() {
    console.log('🌱 Starting Seed...\n');

    // Hash password once (same for all demo users: "demo1234")
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo1234', salt);

    let successCount = 0;
    let skipCount = 0;

    for (const u of demoUsers) {
        // Check if user already exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', u.email)
            .single();

        if (existing) {
            console.log(`⏭️  Skipping ${u.fullName} (already exists)`);
            skipCount++;
            continue;
        }

        const { error } = await supabase.from('users').insert([{
            full_name: u.fullName,
            username: u.username,
            email: u.email,
            password: hashedPassword,
            phone_number: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
            apartment_name: 'Green Valley Apartments',
            block: u.block,
            flat_number: u.flat,
            role: u.role,
            skills_offered: u.skills,
            availability: u.avail,
            latitude: u.lat,
            longitude: u.lng,
        }]);

        if (error) {
            console.error(`❌ Failed to add ${u.fullName}:`, error.message);
        } else {
            console.log(`✅ Added: ${u.fullName.padEnd(20)} | Skills: ${u.skills.join(', ')}`);
            successCount++;
        }
    }

    console.log(`\n🎉 Done! ${successCount} users added, ${skipCount} skipped.`);
    console.log(`\n📋 Demo Login Credentials:`);
    console.log(`   Email: ravi@demo.com (or any @demo.com user)`);
    console.log(`   Password: demo1234`);
}

seed().catch(console.error);
