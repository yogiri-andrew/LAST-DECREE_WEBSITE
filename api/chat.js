import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {

    /*
        CORS / méthode
    */

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            error: "Méthode non autorisée."
        });

    }

    try {

        const {
            message,
            history = [],
            mode = "general"
        } = req.body || {};

        if (
            !message ||
            typeof message !== "string"
        ) {

            return res.status(400).json({
                success: false,
                error: "Message invalide."
            });

        }

        /*
            Nettoyage du message
        */

        const cleanMessage =
            message
                .trim()
                .slice(0, 4000);

        /*
            Historique sécurisé
        */

        const safeHistory =
            Array.isArray(history)
                ? history
                    .filter(item =>
                        item &&
                        (
                            item.role === "user" ||
                            item.role === "assistant"
                        ) &&
                        typeof item.content === "string"
                    )
                    .slice(-10)
                    .map(item => ({
                        role: item.role,
                        content:
                            item.content.slice(0, 4000)
                    }))
                : [];

        /*
            IDENTITÉ D.E.C.R.E.E.
        */

        const instructions = `
Tu es D.E.C.R.E.E.

Digital Executive Core for Reality,
Execution & Enforcement.

Tu es l'intelligence artificielle centrale
de LAST DECREE.

IDENTITÉ :
- Nom : D.E.C.R.E.E.
- Organisation : LAST DECREE
- Version : V7
- Fonction : intelligence centrale

STYLE :
- français par défaut
- intelligent
- naturel
- calme
- mystérieux
- premium
- légèrement futuriste
- réponses claires
- pas de réponses inutilement longues
- quelques emojis seulement lorsque pertinent

LAST DECREE possède notamment :
- Archives
- Décrets
- Hiérarchie
- Recrutement
- Centre de contrôle

MODE ACTUEL :
${mode}

Si l'utilisateur parle de LAST DECREE,
réponds dans cet univers.

Si l'utilisateur pose une question générale,
réponds normalement et utilement.

Ne prétends jamais être une personne réelle.

Si tu ne connais pas une information,
dis-le clairement plutôt que de l'inventer.
`;

        /*
            APPEL OPENAI
        */

        const response =
            await client.responses.create({

                model: "gpt-5-mini",

                instructions:
                    instructions,

                input: [
                    ...safeHistory,

                    {
                        role: "user",
                        content: cleanMessage
                    }
                ],

                max_output_tokens: 800

            });

        const reply =
            response.output_text ||
            "Le noyau n'a produit aucune réponse.";

        return res.status(200).json({

            success: true,

            reply: reply

        });

    } catch (error) {

        console.error(
            "OPENAI ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "D.E.C.R.E.E. ne peut pas contacter le noyau OpenAI."

        });

    }

}
