const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

model.generateContent('Return ONLY this JSON object, nothing else: {"test": true}')
  .then(r => {
    console.log('RAW RESPONSE:');
    console.log(r.response.text());
  })
  .catch(err => {
    console.log('ERROR:', err.message);
  });