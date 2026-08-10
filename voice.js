/*
    D.E.C.R.E.E.
    VOICE SYSTEM
*/

window.DECREE_VOICE = {

    recognition: null,

    speaking: false,


    init: function () {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            console.log(
                "Reconnaissance vocale non supportée."
            );

            return false;
        }

        this.recognition =
            new SpeechRecognition();

        this.recognition.lang = "fr-FR";

        this.recognition.continuous = false;

        this.recognition.interimResults = false;

        return true;
    },


    listen: function (callback) {

        if (!this.recognition) {

            this.init();
        }

        if (!this.recognition) {

            return false;
        }

        this.recognition.start();

        this.recognition.onresult =
            function (event) {

                const text =
                    event.results[0][0].transcript;

                callback(text);
            };

        this.recognition.onerror =
            function () {

                console.log(
                    "Erreur de reconnaissance vocale."
                );
            };

        return true;
    },


    speak: function (text) {

        if (!("speechSynthesis" in window)) {

            return;
        }

        window.speechSynthesis.cancel();

        const cleanText =
            text
                .replace(/<[^>]*>/g, "")
                .replace(/[*_#]/g, "")
                .slice(0, 3000);

        const utterance =
            new SpeechSynthesisUtterance(
                cleanText
            );

        utterance.lang = "fr-FR";

        utterance.rate = 1;

        utterance.pitch = .85;

        utterance.volume = 1;

        this.speaking = true;

        utterance.onend = () => {

            this.speaking = false;
        };

        window.speechSynthesis.speak(
            utterance
        );
    }
};
