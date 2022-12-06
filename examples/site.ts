/*

    Hier kannst Du die Seiten definieren, auf denen der Bot
    aktiv werden soll.

    Alle hier stehenden Werte sind Beispielwerte und müssen angepasst werden.
    Kopiere diese Datei nach der Anpassung in `src/lib/settings/sites.ts` bzw.
    füge dort deine auf die hier vorgestellte Weise definierte Seite hinzu.

    Vergleiche zu Details einer Seitendefinition den Typ `Site`.

*/

const example: Site = {
    /*

        Diese Angaben MÜSSEN bei einer Seite vorhanden sein.

    */

    // MATCH: Der Bot wird nur aktiv, wenn er auf eine Seite
    // (das heißt der Wert von `document.location.host`) trifft,
    // für dieses Muster passt. Nötige Anpassungen im Manifest werden
    // automatisch aus dieser Angabe abgeleitet.
    // Vgl. dazu auch:  https://developer.chrome.com/docs/extensions/mv3/content_scripts/
    match: '*://www.example.com/*',
    // Selectors: Alle CSS-Selektoren-Angaben werden jeweils
    // nacheinander probiert. Sobald der erste Selektor einen Wert
    // zurückgibt, also das selektierte Element vorhanden ist,
    // wird dieser genutzt, die weiteren Angaben ignoriert.
    // Die Möglichkeit, mehrere Selektoren anzugeben, erlaubt also Fallbacks
    // zu definieren.
    selectors: {
        // QUERY: Diese CSS-Selektoren geben an, aus welchem
        // Element (das heißt der Wert von `HTMLElement.innerText`)
        // der Query mithilfe von `src/lib/utils/utils.js:makeQuery`
        // generiert werden soll
        // ALTERNATIV zu einem Array kann hier auch eine Funktion angegeben werden
        // Wird eine Funktion angegeben, ist zu beachten, dass jeder geworfene
        // Fehler zum sofortigen Abbruch des Retrievals führt.
        // Zum erwarteten Typ der Funktion vgl. den Typen `Site['selectors']['query']`
        query: ['.text'],
        // PAYWALL: CSS-Selektoren, unter denen die Paywall gefunden werden kann
        paywall: ['.here_is_the_paywall'],
        // MAIL: CSS-Selektoren, die angeben, wo der Bot andocken soll
        main: ['.attach_bot_here'],
    },

    // Namen der Quell-Publikatione(n), die durchucht werden sollen
    sourceNames: ['Example Newspaper'],

    /*

         Diese Angaben KÖNNEN bei einer Seite vorhanden sein.

    */

    // WAITONLOAD: `waitOnLoad` KANN gesetzt werden.
    // Wenn das Property vorhanden ist und den Wert `true` hat
    // wird jede weitere Aktion verzögert, bis  `Document.readyState`
    // den Wert `complete` besitzt
    waitOnLoad: true,

    // PREPARESITE: `prepareSite` KANN gesetzt werden.
    prepareSite: (currentSite: Document): void => {
        // Wenn das Property vorhanden ist,
        // wird die hier notierte Funktion durchgeführt
        // bevor irgendetwas anderes mit dieser Seite passiert.
        // Das ist nützlich, wenn etwa vorab ein Blurring entfernt werden soll
        // oder eine sonst komplizierte Selektoren-Angabe
        // durch Veränderungenn im Seitendokument vereinfacht werden sollen
    },
};
