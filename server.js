const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({});

app.post('/api/recipe', async (req, res) => {
    console.log('Recipe request received:', req.body);
    
    try {
        const { ingredients, difficulty = 'easy', strictMode = false } = req.body;
        
        if (!ingredients) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        const difficultyInstructions = {
            easy: "Keep it simple with an easy to do cooking recipe that won't take too much time or effort. Should make a meal that is suitable for people who prioritize just wanting eat and be full.",
            medium: "A cooking recipe that will require a bit more time and effort. Should be perfect for those who want to make a nice meal for themselves without taking too much time out of their busy day to do so.",
            hard: "A cooking recipe meant for those willing to put in the time and effort to make something truly good."
        };

        const strictInstruction = strictMode 
            ? "IMPORTANT: Only use the exact ingredients listed. Do not suggest additional ingredients."
            : "You can suggest additional common ingredients if they would improve the recipe.";

        const prompt = `Create a simple recipe using: ${ingredients}.

        Difficulty: ${difficulty}
        ${strictInstruction}

        Format your response exactly like this:

        Recipe Name: [name]

        Ingredients:
        - [ingredient 1]
        - [ingredient 2]
        - [ingredient 3]

        Preparation (If needed for medium/hard recipes) (examples include marinating, making sauces/dressings/spice prep, proofing, roasting/toasting):
        - [preparation 1]
        - [preparation 2]

        Instructions:
        1. [step 1]
        2. [step 2] 
        3. [step 3]

        Cook time: [time]

        Keep it short and simple. Add an extra blank line between instructions for readability. No preamble or summary of the recipe. No bold text. No extra formatting. Maximum 5 ingredients and 5 steps.`;

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

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
    console.log('Using Gemini 2.5 Flash model');
});