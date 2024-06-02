import { OpenAI } from "openai";
import express from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';
import bodyParser from "body-parser";
import cors from "cors";

const apiKey = process.env.API_KEY;
const proxyUrl = process.env.PROXY_URL || 'http://127.0.0.1:7890';

const openai = new OpenAI({
    apiKey: apiKey
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
    const { message } = req.body;
    const options = proxyUrl ? {
        proxy: false,
        httpAgent: new HttpsProxyAgent(proxyUrl),
        httpsAgent: new HttpsProxyAgent(proxyUrl)
    } : {};
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: `${message}` }],
        model: "gpt-3.5-turbo",
    }, options);

    res.json({
        message: completion.choices[0].message.content
    });
});

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
