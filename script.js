/*
    LAST DECREE V7
    MAIN CONTROLLER
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const boot =
            document.getElementById(
                "boot-screen"
            );

        const app =
            document.getElementById("app");

        const progress =
            document.getElementById(
                "boot-progress-bar"
            );

        const bootStatus =
            document.getElementById(
                "boot-status"
            );


        /*
            BOOT SEQUENCE
        */

        let value = 0;

        const bootMessages = [
            "Initialisation du noyau...",
            "Chargement de la mémoire...",
            "Connexion D.E.C.R.E.E....",
            "Vérification des modules...",
            "Interface prête."
        ];


        const bootInterval =
            setInterval(() => {

                value += 20;

                progress.style.width =
                    value + "%";

                const index =
                    Math.min(
                        Math.floor(value / 20),
                        bootMessages.length - 1
                    );

                bootStatus.textContent =
                    bootMessages[index];


                if (value >= 100) {

                    clearInterval(
                        bootInterval
                    );

                    setTimeout(() => {

                        boot.style.opacity =
                            "0";

                        app.style.opacity =
                            "1";

                        setTimeout(() => {

                            boot.style.display =
                                "none";

                        }, 700);

                    }, 400);
                }

            }, 250);


        /*
            ELEMENTS
        */

        const input =
            document.getElementById(
                "user-input"
            );

        const send =
            document.getElementById(
                "send-btn"
            );

        const voice =
            document.getElementById(
                "voice-btn"
            );

        const messages =
            document.getElementById(
                "chat-messages"
            );

        const typing =
            document.getElementById(
                "typing"
            );

        const clear =
            document.getElementById(
                "clear-chat"
            );

        const toast =
            document.getElementById(
                "toast"
            );


        /*
            TOAST
        */

        function showToast(text) {

            toast.textContent = text;

            toast.classList.add("show");

            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2200);
        }


        /*
            AJOUT MESSAGE
        */

        function addMessage(
            content,
            type
        ) {

            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "message " +
                (
                    type === "user"
                        ? "user-message"
                        : "ai-message"
                );


            const label =
                document.createElement(
                    "div"
                );

            label.className =
                "message-label";

            label.textContent =
                type === "user"
                    ? "VOUS"
                    : "D.E.C.R.E.E.";


            const body =
                document.createElement(
                    "div"
                );

            body.className =
                "message-content";

            body.innerHTML =
                formatText(content);


            wrapper.appendChild(label);

            wrapper.appendChild(body);

            messages.appendChild(wrapper);


            messages.scrollTop =
                messages.scrollHeight;
        }


        /*
            FORMATAGE SIMPLE
        */

        function formatText(text) {

            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br>")
                .replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                );
        }


        /*
            ENVOI
        */

        async function sendMessage(
            customText = null
        ) {

            const text =
                customText ||
                input.value.trim();


            if (!text) {

                return;
            }


            if (!customText) {

                input.value = "";

                input.style.height =
                    "45px";
            }


            addMessage(
                text,
                "user"
            );


            typing.style.display =
                "flex";


            try {

                const response =
                    await DECREE_AI.ask(
                        text
                    );


                typing.style.display =
                    "none";


                addMessage(
                    response,
                    "ai"
                );


                /*
                    Lecture vocale
                */

                if (
                    window.DECREE_VOICE
                ) {

                    DECREE_VOICE.speak(
                        response
                    );
                }


            } catch (error) {

                typing.style.display =
                    "none";


                addMessage(
                    "Une erreur interne est survenue.",
                    "ai"
                );

                console.error(error);
            }
        }


        /*
            BOUTON SEND
        */

        send.addEventListener(
            "click",
            () => sendMessage()
        );


        /*
            ENTER
        */

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();
                }
            }
        );


        /*
            AUTO HEIGHT
        */

        input.addEventListener(
            "input",
            () => {

                input.style.height =
                    "auto";

                input.style.height =
                    Math.min(
                        input.scrollHeight,
                        150
                    ) + "px";
            }
        );


        /*
            COMMANDES RAPIDES
        */

        document
            .querySelectorAll(
                ".quick-actions button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const prompt =
                            button.dataset.prompt;

                        sendMessage(
                            prompt
                        );
                    }
                );

            });


        /*
            MODE
        */

        document
            .querySelectorAll(
                ".mode-btn"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".mode-btn"
                            )
                            .forEach(
                                b =>
                                    b.classList
                                     .remove(
                                         "active"
                                     )
                            );


                        button.classList.add(
                            "active"
                        );


                        const mode =
                            button.dataset.mode;


                        DECREE_AI.setMode(
                            mode
                        );


                        const modeText =
                            mode === "general"
                                ? "MODE GÉNÉRAL"
                                : "MODE LAST DECREE";


                        document
                            .getElementById(
                                "current-mode"
                            )
                            .textContent =
                            modeText;


                        document
                            .getElementById(
                                "mode-status"
                            )
                            .textContent =
                            mode.toUpperCase();


                        showToast(
                            modeText
                        );
                    }
                );

            });


        /*
            CLEAR
        */

        clear.addEventListener(
            "click",
            () => {

                messages.innerHTML = "";

                DECREE_AI.history = [];

                addMessage(
                    "Mémoire conversationnelle réinitialisée. D.E.C.R.E.E. est prête.",
                    "ai"
                );

                showToast(
                    "MÉMOIRE EFFACÉE"
                );
            }
        );


        /*
            VOICE
        */

        DECREE_VOICE.init();


        voice.addEventListener(
            "click",
            () => {

                const started =
                    DECREE_VOICE.listen(
                        text => {

                            input.value =
                                text;

                            input.dispatchEvent(
                                new Event(
                                    "input"
                                )
                            );

                            sendMessage();
                        }
                    );


                if (started) {

                    showToast(
                        "ÉCOUTE ACTIVE..."
                    );

                } else {

                    showToast(
                        "VOIX NON DISPONIBLE SUR CE NAVIGATEUR"
                    );
                }
            }
        );


        /*
            MEMORY STATUS
        */

        document
            .getElementById(
                "memory-status"
            )
            .textContent =
            "ACTIVE";


        /*
            SHORTCUT
        */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.ctrlKey &&
                    event.key === "k"
                ) {

                    event.preventDefault();

                    input.focus();
                }
            }
        );


        /*
            CONSOLE
        */

        console.log(
            "%c D.E.C.R.E.E. V7 ONLINE ",
            "background:#ff1744;color:white;padding:8px;font-weight:bold;"
        );

    }
);
