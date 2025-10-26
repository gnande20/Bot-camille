import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask', async (req,res)=>{
  const {message} = req.body;
  if(!message) return res.status(400).json({error:"Pas de message"});

  try{
    const response = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[{role:"user", content:message}],
        max_tokens:250
      })
    });
    const data = await response.json();
    res.json({reply:data.choices[0].message.content});
  }catch(err){
    console.error(err);
    res.status(500).json({reply:"Désolé, le bot est occupé."});
  }
});

app.listen(3000, ()=>console.log('GoaBot ChatGPT backend running on port 3000'));
