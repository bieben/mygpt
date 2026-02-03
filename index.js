import "dotenv/config";
import { OpenAI } from "openai";
import express from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';
import bodyParser from "body-parser";
import cors from "cors";

const apiKey = process.env.OPENAI_API_KEY; 
const openai = new OpenAI({
    apiKey: apiKey
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 健康检查接口
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Server is running normally',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: 3080,
        version: '1.0.0'
    });
});

app.post('/', async (req, res) => {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "user", 
                content: `${message}`
            }
        ],
        model: "gpt-3.5-turbo",
    },
        {
            proxy: false,
            httpAgent: new HttpsProxyAgent('http://127.0.0.1:7890'),
            httpsAgent: new HttpsProxyAgent('http://127.0.0.1:7890')
        }
    );

    res.json({
        message: completion.choices[0].message.content
    });
});

app.listen(3080, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3080');
})
