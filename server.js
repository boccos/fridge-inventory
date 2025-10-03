const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('.'));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post('/api/recipe', async (req, res) => {
    console.log('Recipe request received:', req.body);
    
    try {
        const { ingredients, difficulty = 'easy', strictMode = false } = req.body;
        
        if (!ingredients) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        const strictInstruction = strictMode 
            ? "Only use the exact ingredients I listed."
            : "You can add 1-2 common ingredients if needed.";

        const prompt = `Create a simple recipe using: ${ingredients}

Difficulty: ${difficulty}
${strictInstruction}

Format your response exactly like this:

Recipe Name: [name]

Ingredients:
- [ingredient 1]
- [ingredient 2]
- [ingredient 3]

Instructions:
1. [step 1]
2. [step 2] 
3. [step 3]

Cook time: [time]

Keep it short and simple. No bold text. No extra formatting. Maximum 5 ingredients and 5 steps.`;

        console.log('Sending request to Gemini...');
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        console.log('Gemini response received successfully');
        res.json({ recipe: response.text });
        
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            error: 'Failed to generate recipe',
            details: error.message 
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running on Vercel!', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;