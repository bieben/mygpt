import { OpenAI } from "openai";
import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";

const apiKey = process.env.OPEN_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: `${message}` }],
        model: "gpt-3.5-turbo",
    });

    res.json({
        message: completion.choices[0].message.content
    });
});

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
