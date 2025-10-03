const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/recipe', async (req, res) => {
  try {
    const { ingredients, difficulty, strictMode } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a helpful cooking assistant who suggests recipes based on the ingredients that is available. 
    
    Ingredients available: ${ingredients}
    Difficulty level: ${difficulty}
    ${strictMode ? 'STRICT MODE: ONLY use the ingredients listed above.' : 'You may suggest additional common ingredients if helpful.'}
    
    Provide ONE recipe with:
    - Recipe name
    - Prep and cook time
    - Step-by-step instructions
    - Serving size (Always make serving for 1 person)
    
    Format:
    - Recipe Name
    - Ingredients to use
    - Prep and cook time
    Instructions (Measurements not preferred, steps do not have to be very detailed): 
    - 1. Step one...
    - 2. Step two...

    Make it suitable for ${difficulty} cooking level.
    
    BE DIRECT. No explanations. No thinking process. Just the recipe and nothing else.`;

    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.8,
            topK: 40
        }
    });
    const response = await result.response;
    const recipe = response.text();

    res.json({ recipe });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});