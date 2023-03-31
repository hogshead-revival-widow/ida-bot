/*

    Hier kannst Du die definieren, wie genau der Retrieval-Prozess
    ablaufen soll.

    Alle hier stehenden Werte sind Beispielwerte und müssen angepasst werden.
    Kopiere diese Datei nach der Anpassung in `src/lib/settings/sites.ts` bzw.
    ersetzte die dort vorhandenen Werte entsprechend.

    `sites.ts` MUSS `source` und `fallback` defaultexportieren, insofern sind
    beide erforderlich.

    Vergleiche zu Details einer Quellendefinition den Typ `Source`.

*/

import config from 'config.json';
import STRINGS from './strings.js';

const source: Source = {
    // ISLOGGEDIN: Sobald dieser Selektor gefunden wird, wird die Login-Phase abgebrochen
    // und zur Such-Phase gesprungne
    isLoggedIn: '.class_only_present_if_logged_in',
    // baseURL: Vgl. dazu das entsprechende Property in `./config.jsonc`
    baseURL: config.URL.HOST,
    // PATHS: Vgl. dazu die entsprechenden Propertys in `./config.jsonc`
    paths: {
        search: config.URL.PATHS.SEARCH,
        pdf: config.URL.PATHS.PDF,
        xml: config.URL.PATHS.XML,
        item: config.URL.PATHS.ITEM,
    },
    // SEARCHPARAMS: Vgl. dazu das entsprechende Property in `./config.jsonc`
    searchParams: config.SEARCH_PARAMS,
    // REPLACEINQUERY & removeFromQuery: Vgl. dazu das entsprechende Property in `./config.jsonc`
    replaceInQuery: config.REPLACE_IN_QUERY,
    removeFromQuery: config.REMOVE_FROM_QUERY,
    // LOGIN: Sammlung (Array I) von Schritten (Array II) von Aktionen.
    // Aktionen sind entweder Statusmeldungen (diese werden der Nutzer:in direkt angezeigt)
    // oder Injektionen; die Injektionen finden sich jeweils in den gleichnamigen
    // Dateien in dem Verzeichnis `src/lib/injection`. Sie werden in das geöffnete Quell-Tab
    // injiziert.
    LOGIN: [
        // Der erste Schritt. Alle Schritte werden nacheinander durchlaufen,
        // wobei eine Veränderung im vollständig geladenen Quelltab den Fortgang
        // zum nächsten Schritt auslöst.
        // Ein Schritt kann auch leer sein.
        [
            // Die erste Aktion; jede Aktion wird nacheinander durchgeführt
            { status: STRINGS.STATUS.WAIT_FOR_AUTO_LOGIN },
            // In diesem Beispiel, folgen wir dem Link,
            // der im HREF-Attribut des HTMLAnchorElements, das
            // unter dem angegebenen Selektor `#id_of_login_href` gefunden wird.
            // Der Wert des Propertys wird also als Argument an die Injektion übergeben.
            {
                followLink: `#id_of_login_href`,
                // ONERROR: KANN für eine Injektion gesetzt werden.
                // Es ist es vorhanden, wird der Retrieval-Prozess
                // nicht direkt abgebrochen, sondern solange
                // wiederholt, wie hier angeben ist bzw. bis die Injektion
                // ohne Fehler ausgeführt wird.
                onError: {
                    retry: {
                        max: 5,
                        delay: 1000, // Verzögerung bis zum nächsten Versuch in MS
                        // TOGGLETABFOCUS: KANN für ONERROR gesetzt werden.
                        // Wenn vorhanden und `true` , wird der der Quelltab für die
                        // kurze Zeit fokussiert
                        toggleTabFocus: true,
                    },
                },
            },
        ],
    ],
    // Suche: Sammlung (Array I) von Schritten (Array II) von Aktionen.
    SEARCH:
        // Wenn wir uns in dieser Phase befinden, ist der Login geglückt.
        // Alle Aktionen (Statusmeldungen, Injektionen) können auch hier genutzt werden.
        [
            [
                // Wir folgen wieder einem Link
                { status: STRINGS.STATUS.SEARCH },
                { followLink: '#id_of_first_result' },
            ],
            [
                { status: STRINGS.STATUS.RESULT },
                {
                    // Und extrahieren am Ende die ID des Treffers
                    // Kommt hier kein Wert zurück, wird die Suche
                    // als gescheitert gemeldet.
                    extractId: '#id_of_text',
                },
            ],
        ],
};

// `fallback` MUSS ebenfalls angegeben werden.
// Allerdings ist zu beachten: Wenn `config.URL.FALLBACK_HOST`
// eine leere Zeichen ist, wird das Fallback IGNORIERT.
// Wenn dort aber eine Wert steht, eine URL bezeichnet, und `config.URL.HOST`
// NICHT erreichbar ist, dann wird auf diesem Weg versucht, das Archiv zu erreichen.
const fallback: Source = {
    ...source,
    // bis auf diese andere baseURL ist alles gleich wie oben
    // zumindest in diesem Beispiel. Hier könnte aber auch ein
    // ganz anderer Retrieval-Weg angegeben werden
    baseURL: config.URL.FALLBACK_HOST,
};

export default { source, fallback };
