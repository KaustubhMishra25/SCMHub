const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
dotenv.config();
const app = express();
const port = process.env.port || 5000;
const genAiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAiClient.getGenerativeModel({ model: 'gemini-pro' });
const mongo_connector = require('./mongo_connector');

app.use(express.json()); // This will allow the server to parse JSON from the request body

let sample_queries;

fs.readFile('D:/dev/SCMHub/backend/train-queries.txt', (err, data) => {
    if (err) throw err;
    sample_queries = data.toString();
});



app.post('/gemini', async function (req, res) {
    const prompt = sample_queries+"USER_QUERY"+req.body.prompt;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.send(response.text());
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongo_connector.mongo_run();
});