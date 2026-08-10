import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        status: "online",
        system: "D.E.C.R.E.E."
    });
});

app.post("/api/chat", async (req, res) => {

    try {

        const { messages, mode } = req.body;

        if (!Array.isArray(messages)) {
            return res.status(400).json({
                error: "Messages invalides."
            });
        }

        const systemPrompt = `
Tu es D.E.C.R.E.E.
Digital Executive Core for Reality, Execution & Enforcement.

Tu es l'intelligence centrale de LAST DECREE.

Tu peux répondre normalement à des questions générales :
sciences, histoire, programmation, anime, technologie,
mathématiques, idées créatives, traduction, etc.

Si la question concerne LAST DECREE, utilise les informations
fournies par l'utilisateur et le contexte disponible.

Mode actuel : ${mode || "general"}

Réponds en français sauf si l'utilisateur demande une autre langue.
Sois naturel, utile et précis.
`;

        const response = await client.responses.create({
            model: "gpt-5-mini",
            instructions: systemPrompt,
            input: messages
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "D.E.C.R.E.E. ne peut pas contacter le noyau IA."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `D.E.C.R.E.E. backend online on port ${PORT}`
    );
});
