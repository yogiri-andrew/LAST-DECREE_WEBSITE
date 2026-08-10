/*
    D.E.C.R.E.E.
    AI ENGINE
*/

window.DECREE_AI = {

    mode: "general",

    history: [],

    /*
        IMPORTANT :

        Ne mets PAS ta clé API ici.

        Ton serveur devra exposer :

        POST /api/chat

        avec :

        {
            messages: [...]
        }

        et retourner :

        {
            reply: "..."
        }
    */

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

        /*
            Évite une mémoire infinie.
        */

        if (this.history.length > 20) {

            this.history =
                this.history.slice(-20);
        }
    },


    command: function (text) {

        const command =
            text.trim().split(/\s+/)[0].toLowerCase();

        if (
            window.DECREE_COMMANDS &&
            window.DECREE_COMMANDS[command]
        ) {

            return window.DECREE_COMMANDS[
                command
            ].execute();
        }

        return null;
    },


    localAnswer: function (text) {

        const lower =
            text.toLowerCase();


        if (
            lower.includes("qui es-tu") ||
            lower.includes("qui est decree") ||
            lower.includes("ton nom")
        ) {

            return `
Je suis D.E.C.R.E.E.

Digital Executive Core for Reality,
Execution & Enforcement.

Je suis l'intelligence centrale de
LAST DECREE.

Mais je peux également discuter de sujets
généraux : technologie, programmation,
anime, histoire, sciences, idées créatives,
traduction et bien plus encore.
`;
        }


        if (
            lower.includes("last decree") &&
            (
                lower.includes("c'est quoi") ||
                lower.includes("explique")
            )
        ) {

            return `
LAST DECREE est une organisation numérique
structurée autour de plusieurs modules :

• Archives
• Décrets
• Hiérarchie
• Recrutement
• Centre de contrôle

D.E.C.R.E.E. constitue son intelligence
centrale.
`;
        }


        if (
            lower.includes("bonjour") ||
            lower.includes("salut") ||
            lower.includes("hello")
        ) {

            return `
Connexion établie.

Bonjour.

D.E.C.R.E.E. est opérationnelle.
Que puis-je faire pour vous ?
`;
        }


        return null;
    },


    ask: async function (text) {

        /*
            Vérification commande
        */

        const commandResult =
            this.command(text);

        if (commandResult) {

            return commandResult;
        }


        /*
            Réponses locales simples
        */

        const local =
            this.localAnswer(text);

        if (local) {

            return local;
        }


        /*
            Tentative API
        */

        try {

            const messages = [

                {
                    role: "system",

                    content:
                        DECREE_KNOWLEDGE.personality +
                        "\n\n" +
                        JSON.stringify(
                            DECREE_KNOWLEDGE
                        )
                },

                ...this.history,

                {
                    role: "user",
                    content: text
                }

            ];


            const response =
                await fetch(
                    this.endpoint,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            messages: messages,
                            mode: this.mode
                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "API indisponible"
                );
            }


            const data =
                await response.json();


            if (!data.reply) {

                throw new Error(
                    "Réponse IA invalide"
                );
            }


            this.addMessage(
                "user",
                text
            );

            this.addMessage(
                "assistant",
                data.reply
            );


            return data.reply;


        } catch (error) {

            console.warn(error);


            return `
⚠️ CONNEXION IA EXTERNE INDISPONIBLE.

Le noyau local reste opérationnel.

Je peux toujours utiliser mes modules
LAST DECREE et mes réponses locales.

Pour activer l'IA générale complète,
configurez le serveur D.E.C.R.E.E. /api/chat.
`;
        }
    }
};
