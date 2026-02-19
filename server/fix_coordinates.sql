-- Run this in Supabase SQL Editor to update ALL demo users with correct coordinates
-- and also update any existing user (Lohitha) with Bangalore coordinates

-- Update all demo seeded users with coordinates spread in 2km radius
UPDATE users SET latitude = 12.9716, longitude = 77.5946 WHERE email = 'ravi@demo.com';
UPDATE users SET latitude = 12.9720, longitude = 77.5950 WHERE email = 'priya@demo.com';
UPDATE users SET latitude = 12.9730, longitude = 77.5960 WHERE email = 'arjun@demo.com';
UPDATE users SET latitude = 12.9725, longitude = 77.5955 WHERE email = 'sunita@demo.com';
UPDATE users SET latitude = 12.9710, longitude = 77.5935 WHERE email = 'karthik@demo.com';
UPDATE users SET latitude = 12.9705, longitude = 77.5940 WHERE email = 'deepa@demo.com';
UPDATE users SET latitude = 12.9700, longitude = 77.5945 WHERE email = 'suresh@demo.com';
UPDATE users SET latitude = 12.9745, longitude = 77.5965 WHERE email = 'ananya@demo.com';
UPDATE users SET latitude = 12.9735, longitude = 77.5970 WHERE email = 'mohan@demo.com';
UPDATE users SET latitude = 12.9750, longitude = 77.5930 WHERE email = 'lakshmi@demo.com';
UPDATE users SET latitude = 12.9760, longitude = 77.5980 WHERE email = 'vikram@demo.com';
UPDATE users SET latitude = 12.9695, longitude = 77.5920 WHERE email = 'kavitha@demo.com';
UPDATE users SET latitude = 12.9680, longitude = 77.5910 WHERE email = 'ramesh@demo.com';
UPDATE users SET latitude = 12.9770, longitude = 77.5990 WHERE email = 'nisha@demo.com';
UPDATE users SET latitude = 12.9690, longitude = 77.5900 WHERE email = 'sanjay@demo.com';
UPDATE users SET latitude = 12.9740, longitude = 77.5975 WHERE email = 'meena@demo.com';
UPDATE users SET latitude = 12.9755, longitude = 77.5985 WHERE email = 'arun@demo.com';
UPDATE users SET latitude = 12.9665, longitude = 77.5895 WHERE email = 'pooja@demo.com';
UPDATE users SET latitude = 12.9780, longitude = 77.5995 WHERE email = 'girish@demo.com';
UPDATE users SET latitude = 12.9675, longitude = 77.5905 WHERE email = 'radha@demo.com';

-- Update ALL other users (like Lohitha) with Bangalore center coordinates
-- so they can find nearby workers
UPDATE users 
SET latitude = 12.9716, longitude = 77.5946
WHERE latitude IS NULL OR latitude = 0;

-- Verify
SELECT full_name, email, latitude, longitude, skills_offered FROM users ORDER BY created_at;
