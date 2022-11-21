/*

    Hier kannst Du alle Zeichenketten definieren, die der Nutzer:in angezeigt
    werden.

    Kopiere diese Datei nach der Anpassung in `src/lib/settings/strings.ts`.

*/
import config from 'config.json';

// Status-Meldungen, die nicht vom Status der Site abhängen
// Sie (werden oberhalb des Fortschrittsbalken angezeigt)
// Zusätzlich werden die Statusmeldungen in `STRINGS.INFOBOX` genutzt
enum StatusMessage {
    WAIT_FOR_AUTO_LOGIN = 'Versuche Login. Dabei kann das Bild kurz flackern. Bitte warten... ',
    WAIT_AFTER_LOGIN = 'Login erfolgreich! Warte auf Weiterleitung...',
    SEARCH = 'Suche...',
    RESULT = 'Artikel wird aufgerufen...',
}

const STRINGS = {
    STATUS: StatusMessage,
    PAGES: {
        POPUP: {
            TITLE: config.NAME,
            FAQ_BUTTON: 'FAQ',
            CONTACT_BUTTON: 'Kontakt',
            CONTACT_MAILTO: `mailto:${config.CONTACT_ARCHIVE}?subject=[${config.NAME}][Frage]`,
            MAIL: `
                <a href="mailto:${config.CONTACT_ARCHIVE}?subject=[${config.NAME}][Frage]">
                    ${config.CONTACT_ARCHIVE}
                </a>
            `,
        },
        OPTIONS: {
            PAGE_TITLE: `${config.NAME}: Hilfe`,
            TITLE: `${config.NAME}`,
            SUBTITLE:
                'Deutsche Nachrichtenseiten im Browser über das Pressearchiv lesen',
            FOOTER: /* HTML */ `
                <a
                    href="mailto:${config.CONTACT_ARCHIVE}?subject=[${config.NAME}] [Feedback/Bugs]"
                >
                    Feedback / Bugs
                </a>
                -
                <a href="${config.REPOSITORY}">Quelltext</a>
            `,
            SUPPORTED_SITES:
                '<p>Zur Zeit kann der Bot Sie auf diesen Websiten unterstützen:</p>',
            FAQ: [
                {
                    // Jede FAQ-Frage muss die Propertys `label` (Antwort-Überschrift),
                    // `question` (Frage, wird links in der Übersicht angezeigt)
                    // und `answer` beinhalten, wobei `answer` HTML sein kann.
                    // Die Fragen werden in der hier angezeigten Reihenfolge angezeigt.
                    // Vgl. dazu `src/faq/faq.html` bzw. ``src/faq/faq.ts`.
                    // Beachte: Der "Unterstützte Webseiten"-FAQ-Eintrag wird abweichend dynamisch
                    // aus dem Manifest und generiert (vgl. `src/faq/faq.ts`); die Links
                    // werden nach dem Text, der oben in `SUPPORTED_SITES` definiert ist, angezeigt.
                    label: 'Zur Zeit nur per VPN verfügbar',
                    question:
                        'Warum funktioniert der Bot im Moment nicht von unterwegs?',
                    answer: /* HTML */ ` <p>
                            Voraussetzung für die Nutzung des Bots ist, dass die Seite
                            <a href="${config.URL.HOST}">${config.URL.HOST}</a>
                            erreichbar ist. Das ist der Fall, wenn Sie zuhause mit dem
                            VPN verbunden sind oder im Büro sitzen. Das klappt ganz ohne
                            Ihr Zutun.
                        </p>
                        <p>
                            Bitte haben Sie Verständnis, dass für eine Übergangszeit der
                            Bot nicht außerhalb des Büros bzw. VPNs zur Verfügung steht.
                            Das hängt mit der Umstellung vom Pressearchiv auf die
                            crossmediale Suche zusammen.
                        </p>
                        <p>
                            Die crossmediale Suche soll bald auch wieder außerhalb des
                            Büros erreichbar sein.
                            <strong
                                >Sobald das der Fall ist, können Sie wieder wie gewohnt
                                den Bot überall nutzen</strong
                            >, wo Sie diese Erweiterung installieren können: Auch von
                            unterwegs und ohne spezielle Software wie z. B. VPN.
                        </p>`,
                },
                {
                    label: 'Ausprobieren',
                    question: 'Wie kann ich das ausprobieren?',
                    answer: /* HTML */ `
                        <a
                            href="https://www.zeit.de/2021/11/soziale-ungleichheit-identitaetspolitik-diskriminierung-armut-bildung"
                            target="_blank"
                            >Hier entlang (Link).</a
                        >
                    `,
                },
                {
                    label: 'Update',
                    question:
                        'Warum muss ich die Erweiterung bei größeren Updates selbst reaktivieren?',
                    answer: /* HTML */ `
                        <p>
                            Fast alle Updates sind vollautomatisch. Sie müssen nichts
                            tun.
                        </p>

                        <p>
                            Fügt das Update jedoch eine neue Presse-Website hinzu, muss
                            die Erweiterung eine neue Berechtigung von Ihnen anfragen.
                            Bis sie diese Erlaubnis hat, bleibt sie deaktiviert. Das
                            dient
                            <em>Ihrer Sicherheit</em>. Denn Bot kann nur
                            <em>nach Ihrer Erlaubnis</em> auf eine Seite zugreifen, um
                            Ihnen dann dort den Volltext-Artikel anzuzeigen.
                        </p>

                        <p>
                            Wenn Sie mögen, informieren wir Sie vorab über größere
                            Updates. Melden Sie sich dafür
                            <a
                                href="mailto:${config.CONTACT_ARCHIVE}?subject=[Abo] Mailing-Liste bei Updates&body=Bitte auf die Mail-Liste eintragen."
                                >hier</a
                            >.
                        </p>
                    `,
                },
                {
                    label: 'So funktioniert das Add-On',
                    question: 'Wie funktioniert das?',
                    answer: /* HTML */ `
                        <p>
                            Wenn die Extension einen nicht frei verfügbaren Artikel auf
                            einer der unterstützten Nachrichtenseiten findet, dann:
                        </p>
                        <ol>
                            <li>Öffnet sich im Hintergrund ein neuer Tab.</li>
                            <li>
                                In der crossmedialen SUche wird automatisch der Artikel
                                gesucht.
                            </li>
                            <li>
                                Wird der Artikel gefunden, wird der Volltext angezeigt,
                                der gefundene Artikel und das Artikel-PDF verlinkt.
                            </li>
                        </ol>
                        <p>Der Vorgang dauert im Regelfall wenige Sekunden.</p>
                    `,
                },
                {
                    label: 'Das kann schiefgehen',
                    question: 'Was kann schiefgehen?',
                    answer: /* HTML */ `
                        <p>
                            Es kann passieren, dass Bot den Artikel nicht findet. In dem
                            Fall werden Ihnen weitere Optionen angezeigt.
                        </p>

                        <p>Das sind mögliche Gründe:</p>

                        <ul>
                            <li>
                                Anriss oder Titel können sich von der Druckausgabe
                                unterscheiden.
                            </li>
                            <li>Möglicherweise ist der Artikel online-exklusiv.</li>
                            <li>
                                Artikel aus der gedruckten Ausgabe sind ggf. noch nicht
                                verfügbar.
                            </li>
                        </ul>
                    `,
                },
                {
                    label: 'Hilfe',
                    question: 'Hilfe!',
                    answer: /* HTML */ `
                        Etwas funktioniert nicht? Wir helfen gerne weiter:
                        <a
                            href="mailto:${config.CONTACT_ARCHIVE}?subject=[${config.NAME}] [Frage]"
                        >
                            Infodesk </a
                        >.
                    `,
                },
            ],
        },
    },
    TEMPLATE: {
        // Diese Propertys werden in den gleichnamigen Templates in `src/lib/ui/templates` genutzt.
        RESULT: {
            // Ergebnis-Template; wird der Artikel NICHT gefunden, wird das `RETRIEVAL_FAILED` genutzt (siehe unten)
            ARCHIVE_NAME: 'Pressearchiv', // wird oberhalb des Treffers angezeigt
            LINK_SEARCH: 'Artikel ist falsch? Selbst suchen! (Link)',
            LINK_ARCHIVE: 'Artikel im Archiv (Link)',
            LINK_PDF: 'Artikel als PDF anzeigen (Link)',
            DISCLAIMER: 'Nur für interne Zwecke! Copyright: Rechteinhaber', // wird am Ende des Treffers angezeigt
        },
        INFO_BOX: {
            // Template für die Box, die vor und während der Suche angezeig wird
            TITLE: config.NAME,
            MAIL_QUESTION_LABEL: config.CONTACT_ARCHIVE,
            MAIL_QUESTION_MAILTO: `mailto:${config.CONTACT_ARCHIVE}?subject=[${config.NAME}] Frage`, // Vorlage für Kontakt-Email bei Klick auf `MAIL_QUESTION_LABEL`
            START_BUTTON_LABEL: 'Volltext suchen', // Klick auf diesen Knopf löst die Suche aus
            REFRESH_BUTTON_LABEL: 'Seite aktualisieren', // wird angezeigt, wenn es keine Verbindung zum Archiv gibt
        },
    },
    INFO_BOX: {
        // Statusmeldungen, die nicht abhängig vom Such-Prozess sind (Ergänzung zu `StatusMessage`)
        PREPARE_BOT: 'Bereite Suche vor...',
        CHECKING_CONNECTION: 'Prüfe Verbindung zum Pressearchiv...',
        OFFER_START: `Wenn Sie den den Artikel für interne Zwecke benötigen, kann ${config.NAME} hier für Sie danach suchen.`,
        // wird angezeigt, wenn das Archiv nicht erreichbar ist
        NOT_REACHABLE:
            /* HTML */
            `
                ${config.NAME} kann das Pressearchiv nicht erreichen. Tun Sie folgendes,
                um nach dem Volltext suchen zu können:<br />
                <ol type="1">
                    <li>Verbinden Sie sich mit dem -LAN, -WLAN oder VPN.</li>
                    <li>Aktualisieren Sie diese Seite.</li>
                </ol>
            `,
        // wird angezeigt, wenn der Artikel NICHT gefunden wird
        RETRIEVAL_FAILED:
            /* HTML */
            `
                Der Artikel konnte leider nicht gefunden werden. Das kann verschiedene
                Gründe haben.

                <ul>
                    <li>
                        Anriss oder Titel können sich von der Druckausgabe
                        unterscheiden.
                    </li>
                    <li>Möglicherweise ist der Artikel online-exklusiv.</li>
                    <li>
                        Artikel aus der gedruckten Ausgabe sind ggf. noch nicht
                        verfügbar.
                    </li>
                </ul>
                &rarr; Nutzen Sie das offene Tab, um nach Stichworten zu suchen. <br />
                &rarr; Fragen Sie die Presse-Expert*innen nach dem Artikel:
                <a
                    href="mailto:${config.CONTACT_ARCHIVE}?subject=Presserecherche: Artikel auf ${location.href}&body=Hallo, %0D%0A%0D%0A könnten Sie mir bitte den folgenden Artikel beschaffen? %0D%0A%0D%0A URL: ${location.href} %0D%0A%0D%0A Vielen Dank."
                    >Mail an Infodesk</a
                >.
            `,

        CANT_EXTRACT: /* HTML */ ` <p>
                Das sollte nicht passieren: Beim Extrahieren des Suchbegriffs trat ein
                Fehler auf.
                <a
                    href="mailto:${config.CONTACT_SUPPORT}?subject=[${config.NAME}] [${config.VERSION}] Problem auf [${location.href}]&body=Fehler beim Extrahieren der Artikeldaten."
                    >Bitte melden Sie den Fehler hier.</a
                >
            </p>
            <p>
                Das können Sie jetzt tun: <br />
                &rarr; Klicken Sie <a href="${config.URL.HOST}">hier</a>, um selbst im
                Pressearchiv zu suchen. <br />
                &rarr; Fragen Sie die Presse-Expert*innen nach dem Artikel:
                <a
                    href="mailto:${config.CONTACT_ARCHIVE}?subject=Presserecherche: Artikel auf ${location.href}&body=Hallo, %0D%0A%0D%0A könnten Sie mir bitte den folgenden Artikel beschaffen? %0D%0A%0D%0A URL: ${location.href} %0D%0A%0D%0A Vielen Dank."
                    >Mail an Infodesk</a
                >.
            </p>`,
    },
} as const;

export default STRINGS;
