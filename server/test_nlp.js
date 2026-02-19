try {
    console.log("Loading NLP module...");
    const { parseIntent } = require('./utils/nlp');
    console.log("Module loaded successfully.");

    const sentences = [
        "I need a plumber today evening",
        "Looking for a maths tutor",
        "My sink is leaking",
        "Need someone to clean my apartment this weekend",
        "Electrician needed for fan repair"
    ];

    console.log("Starting tests...");
    sentences.forEach(sentence => {
        console.log(`\nInput: "${sentence}"`);
        const result = parseIntent(sentence);
        console.log("Result:", JSON.stringify(result, null, 2));
    });
    console.log("\nAll tests completed.");
} catch (error) {
    console.error("Critical Error during test:", error);
}
