/*
    COMMANDES D.E.C.R.E.E.
*/

window.DECREE_COMMANDS = {

    "/help": {
        description: "Affiche les commandes disponibles",

        execute: function () {

            return `
COMMANDES D.E.C.R.E.E.

 /help
 Affiche cette liste.

 /archives
 Accès aux Archives.

 /decret
 Informations sur les Décrets.

 /hierarchie
 Affiche la hiérarchie.

 /recrutement
 Informations sur le recrutement.

 /systeme
 État du système.

 /clear
 Efface la conversation.
`;
        }
    },


    "/archives": {
        execute: function () {

            return `
[ARCHIVES]

Les Archives constituent la mémoire documentaire
de LAST DECREE.

Accès : DISPONIBLE
État : OPÉRATIONNEL
`;
        }
    },


    "/decret": {
        execute: function () {

            return `
[MODULE DÉCRET]

Le système des Décrets permet de publier,
consulter et organiser les directives de
LAST DECREE.

État : OPÉRATIONNEL
`;
        }
    },


    "/hierarchie": {
        execute: function () {

            return `
[HIÉRARCHIE]

XI — Observateur
X — Archiviste
IX — Veilleur
VIII — Exécuteur
VII — Gardien
VI — Émissaire
V — Ombre
IV — Main du Décret
III — Héritier
Last Witness
I — Le Sans Nom
The Last Decree
`;
        }
    },


    "/recrutement": {
        execute: function () {

            return `
[RECRUTEMENT]

Le module de recrutement permet aux nouveaux
membres de rejoindre LAST DECREE.

État : DISPONIBLE
`;
        }
    },


    "/systeme": {
        execute: function () {

            return `
[D.E.C.R.E.E. SYSTEM]

CORE ............... ONLINE
MEMORY ............. ONLINE
VOICE .............. READY
GENERAL AI ......... READY
LAST DECREE ........ ONLINE

STATUS : NOMINAL
`;
        }
    }

};
