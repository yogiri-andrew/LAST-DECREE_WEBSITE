/*
    LAST DECREE V7
    D.E.C.R.E.E. — OPENAI CORE
*/

window.DECREE_AI = {

    mode: "general",

    history: [],

    endpoint: "/api/chat",

    setMode: function (mode) {
        this.mode = mode;
        return mode;
    },

    addMessage: function (role, content) {

        this.history.push({
            role: role,
            content: content
        });

        if (this.history.length > 20) {
            this.history =
                this.history.slice(-20);
        }
    },

    ask: async function (text) {

        const cleanText =
            String(text || "").trim();

        if (!cleanText) {
            return "Veuillez entrer une commande.";
        }

        try {

            /*
                Préparation de l'historique
            */

            const history =
                this.history
                    .filter(message =>
                        message.role === "user" ||
                        message.role === "assistant"
                    )
                    .slice(-10);

            /*
                APPEL AU SERVEUR VERCEL
            */

            const response =
                await fetch(this.endpoint, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message: cleanText,

                        history: history,

                        mode: this.mode

                    })

                });

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Erreur du noyau OpenAI."
                );

            }

            if (!data.reply) {

                throw new Error(
                    "Réponse OpenAI vide."
                );

            }

            /*
                MÉMOIRE
            */

            this.addMessage(
                "user",
                cleanText
            );

            this.addMessage(
                "assistant",
                data.reply
            );

            return data.reply;

        } catch (error) {

            console.error(
                "D.E.C.R.E.E. OPENAI ERROR:",
                error
            );

            return `
⚠️ CONNEXION AU NOYAU OPENAI IMPOSSIBLE.

Le serveur D.E.C.R.E.E. n'a pas pu contacter
le noyau externe.

Vérifiez la configuration Vercel
et OPENAI_API_KEY.
`;

        }

    }

};
