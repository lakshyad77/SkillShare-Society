# SkillShare-Society
Connecting Neighbors, Empowering Communities.
A Hyperlocal Skill Exchange Platform for Apartments and nearby surroundings
SkillShare Society is a full-stack hyperlocal community platform that connects residents within the same apartment complex or a 1km radius for skill exchange and safety.
It enables neighbors to request or offer services such as tutoring, plumbing, driving help, or cleaning — while ensuring secure real-world interaction through AI-driven matching, OTP-verified sessions, and an integrated emergency SOS system.

#Project Overview
SkillShare Society creates a trusted ecosystem where:
Residents can seek help from verified neighbors
Skilled individuals can offer services within their locality
Society management can monitor safety through real-time alerts
Service sessions are secured using OTP-based verification
Emergency situations can be handled instantly with a premium SOS system
The platform integrates AI-powered matchmaking, real-time communication, and location-based trust mechanisms to create a safe and collaborative environment.

Core Features & Modules
1. Smart Authentication & Resident Profiles
Role-Based Access
Users can register as:
Requester (seeking help)
Worker (offering skills)
Both

Location Intelligence
Automatically captures GPS coordinates during signup
Enables accurate distance-based matching

Society Details Tracking
Apartment Name
Block Number
Flat Number

Used to prioritize:
Same Block > Same Apartment > Nearby Residents
Dynamic Signup UI
Worker-specific fields (skills, availability) are shown only if required

2. NeighbourMatch AI Chatbot
Natural Language Input:
"My vehicle is punctured"
"Looking for a math tutor this weekend"

Automatically extracts:
Required Skill
Preferred Time
Hyperlocal Search
Sorts neighbors by proximity
Displays real-time distance (e.g., 200m)
Fallback Logic

Smart keyword matching when AI is unavailable

3. Secure Service Flow & In-App OTP

Dedicated dashboard for:
Sent Requests
Received Requests
Session OTP Verification
Worker accepts request
Unique 6-digit OTP generated
OTP visible only to Worker
Requester must enter OTP to activate session

✅ Prevents:
Fake service completion
Fraudulent remote acceptance
Unauthorized entry

4. Premium Emergency SOS System
One-tap SOS button on dashboard
Emergency UI includes:
Pulsing alert animation
"Transmitting LIVE GPS" status
Live emergency timer
Mobile-style hang-up option
Admin / Security Panel

Receives real-time SOS alerts with:
Resident Name
Phone Number
Flat Number
Live Location

5. Real-Time Communication
Powered by Socket.io
Enables:
Instant SOS alerts
OTP updates
Live service request notifications
Dashboard updates without refresh

Supported Skills & Categories

The platform currently supports:
Plumbing (sink leaks, taps, drains)
Electrical Work (wiring, fans, power issues)
Mechanic (punctures, petrol, engine issues)
Tutoring (math, science, exams)
Driving (pickups, car drops)
Cooking (meals, recipes)
Cleaning (maid services)
Painting (wall colors)
Carpentry (furniture repair)
Gardening (plants, lawn care)

Tech Stack:
Layer	Technology
Frontend	React.js, Framer Motion, Lucide
Backend	Node.js, Express.js
Database	Supabase (PostgreSQL)
Real-Time	Socket.io
AI Engine	Google Gemini API

Target Audience
Apartment Residents
Need quick, trustworthy help from nearby neighbors

Skilled Neighbors
Want to earn or assist within their own community

Society Management
Ensure safety via centralized SOS monitoring

Future Enhancements
Escrow-based payment system
Women-only service filter
Behavior-based safety rating
In-app wallet integration
AI-based unsafe message detection
