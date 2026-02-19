/**
 * AI-Powered NLP for NeighbourMatch Bot
 * 
 * Priority chain:
 *  1. Google Gemini (if GEMINI_API_KEY set)
 *  2. OpenAI GPT (if OPENAI_API_KEY set)
 *  3. Keyword-based fallback (works with no API key)
 */

// ============================================================
// FALLBACK: Keyword-based parser (no API needed)
// ============================================================
const skillKeywordMap = {
    // Plumbing
    'sink': 'Plumbing', 'leak': 'Plumbing', 'leaking': 'Plumbing', 'plumber': 'Plumbing',
    'pipe': 'Plumbing', 'plumbing': 'Plumbing', 'tap': 'Plumbing', 'drain': 'Plumbing',
    'drip': 'Plumbing', 'flush': 'Plumbing', 'bathroom': 'Plumbing', 'toilet': 'Plumbing', 'shower': 'Plumbing',
    // Tutor
    'math': 'Tutor', 'maths': 'Tutor', 'tutor': 'Tutor', 'teach': 'Tutor', 'teacher': 'Tutor',
    'study': 'Tutor', 'exam': 'Tutor', 'exams': 'Tutor', 'school': 'Tutor', 'homework': 'Tutor',
    'assignment': 'Tutor', 'learn': 'Tutor', 'academic': 'Tutor', 'grade': 'Tutor',
    'student': 'Tutor', 'education': 'Tutor', 'science': 'Tutor', 'physics': 'Tutor',
    'chemistry': 'Tutor', 'english': 'Tutor', 'depressed': 'Tutor', 'stressed': 'Tutor',
    'struggling': 'Tutor', 'fail': 'Tutor', 'failing': 'Tutor', 'marks': 'Tutor', 'test': 'Tutor',
    // Cooking
    'cook': 'Cooking', 'food': 'Cooking', 'cooking': 'Cooking', 'meal': 'Cooking',
    'chef': 'Cooking', 'lunch': 'Cooking', 'dinner': 'Cooking', 'breakfast': 'Cooking',
    'recipe': 'Cooking', 'kitchen': 'Cooking', 'hungry': 'Cooking', 'eat': 'Cooking',
    // Cleaning
    'clean': 'Cleaning', 'maid': 'Cleaning', 'cleaning': 'Cleaning', 'sweep': 'Cleaning',
    'dust': 'Cleaning', 'dirty': 'Cleaning', 'mess': 'Cleaning', 'vacuum': 'Cleaning', 'tidy': 'Cleaning',
    // Electrician
    'electric': 'Electrician', 'wire': 'Electrician', 'electrician': 'Electrician',
    'fan': 'Electrician', 'switch': 'Electrician', 'power': 'Electrician', 'light': 'Electrician',
    'fuse': 'Electrician', 'socket': 'Electrician', 'bulb': 'Electrician',
    // Painting
    'paint': 'Painting', 'painting': 'Painting', 'painter': 'Painting',
    'wall': 'Painting', 'colour': 'Painting', 'color': 'Painting',
    // Driving
    'driver': 'Driving', 'drive': 'Driving', 'driving': 'Driving', 'cab': 'Driving',
    'car': 'Driving', 'ride': 'Driving', 'drop': 'Driving', 'transport': 'Driving', 'pick': 'Driving',
    // Carpentry
    'carpenter': 'Carpentry', 'wood': 'Carpentry', 'furniture': 'Carpentry',
    'carpentry': 'Carpentry', 'shelf': 'Carpentry', 'door': 'Carpentry',
    'broken': 'Carpentry', 'fix': 'Carpentry', 'repair': 'Carpentry', 'table': 'Carpentry',
    // Gardening
    'garden': 'Gardening', 'plant': 'Gardening', 'gardening': 'Gardening',
    'tree': 'Gardening', 'grass': 'Gardening', 'flower': 'Gardening', 'lawn': 'Gardening',
    // Mechanic / Vehicle
    'bike': 'Mechanic', 'car': 'Mechanic', 'vehicle': 'Mechanic', 'petrol': 'Mechanic',
    'puncture': 'Mechanic', 'punchered': 'Mechanic', 'tyre': 'Mechanic', 'engine': 'Mechanic',
    'mechanic': 'Mechanic', 'scooter': 'Mechanic', 'gas': 'Mechanic', 'oil': 'Mechanic',
};

const timeKeywords = {
    'morning': 'Morning', 'afternoon': 'Morning',
    'evening': 'Evening', 'night': 'Evening', 'tonight': 'Evening', 'today': 'Evening',
    'weekend': 'Weekend', 'saturday': 'Weekend', 'sunday': 'Weekend',
};

function keywordParse(message) {
    const lower = message.toLowerCase();
    const words = lower.split(/\W+/);

    let skill = null;
    for (const word of words) {
        if (skillKeywordMap[word]) { skill = skillKeywordMap[word]; break; }
        // substring match for compound words
        for (const [key, val] of Object.entries(skillKeywordMap)) {
            if (word.includes(key) || lower.includes(key)) { skill = val; break; }
        }
        if (skill) break;
    }

    let time = null;
    for (const [key, val] of Object.entries(timeKeywords)) {
        if (lower.includes(key)) { time = val; break; }
    }

    return { skill, time };
}

// ============================================================
// GEMINI-based parser
// ============================================================
async function geminiParse(message) {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a helper that parses service requests from apartment/community residents.

From this message: "${message}"

Extract:
1. skill - one of: Plumbing, Tutor, Cooking, Cleaning, Electrician, Painting, Driving, Carpentry, Gardening, Mechanic, or null
2. time - one of: Morning, Evening, Weekend, or null

Respond ONLY in this JSON format, nothing else:
{"skill": "...", "time": "..."}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (err) {
        console.error('[Gemini] Error:', err.message);
    }
    return null;
}

// ============================================================
// OpenAI-based parser
// ============================================================
async function openAIParse(message) {
    try {
        const OpenAI = require('openai');
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You extract skill and time from community service requests. 
Skills: Plumbing, Tutor, Cooking, Cleaning, Electrician, Painting, Driving, Carpentry, Gardening, Mechanic.
Times: Morning, Evening, Weekend.
Always respond ONLY with JSON: {"skill": "...", "time": "..."} — use null if not found.`
                },
                { role: 'user', content: message }
            ],
            max_tokens: 50,
            temperature: 0,
        });

        const text = response.choices[0].message.content.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (err) {
        console.error('[OpenAI] Error:', err.message);
    }
    return null;
}

// ============================================================
// MAIN: parseIntent — tries AI first, falls back to keywords
// ============================================================
async function parseIntent(message) {
    // Try Gemini first
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
        console.log('[NLP] Using Gemini AI...');
        const result = await geminiParse(message);
        if (result) {
            console.log('[NLP] Gemini result:', result);
            return result;
        }
    }

    // Try OpenAI next
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
        console.log('[NLP] Using OpenAI...');
        const result = await openAIParse(message);
        if (result) {
            console.log('[NLP] OpenAI result:', result);
            return result;
        }
    }

    // Fallback to keyword parsing
    console.log('[NLP] Using keyword fallback...');
    const result = keywordParse(message);
    console.log('[NLP] Keyword result:', result);
    return result;
}

module.exports = { parseIntent };
