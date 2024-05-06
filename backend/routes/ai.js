import runChat from "../utils/gemini";
const express = require('express');
const router = express.Router();

router.post('/gemini', async (req, res) => {
    try{    
        const userData = req.body.userData;
        const query = req.body.prompt;

        var prompt = "You are the best business advisor, that gives advice on SCM related queries. First here is the business data: \n"+userData+"\n";
        prompt = prompt+ "\nNow here is the user's query. Answer it  while keeping in mind the user's data. Make the response as closely related to the user data as possible: "+query;

        const response = await runChat(prompt);
        res.status(201).json({ success: true, message: response })
    }catch(error){
        console.error('Error fetching response:', error);
        res.status(500).json({ success: false, message: 'Error fetching response! Please try again.' });
    }    
});