export const mailContactArchive = 'test@test.de'

// Status'

export const MSG_LOGIN_SELECTION = 'Archiv wird ausgewählt...'
export const MSG_LOGIN_ACCESS = 'Konto wird eingeloggt...'
export const MSG_START_SEARCH = 'Suche wird durchgeführt...'
export const MSG_ARTICLE = 'Artikel wird aufgerufen...'
export const MSG_ARTICLE_FAILURE = 'Artikel nicht gefunden.'

// Infobox

export const INFOBOX_ID = 'idabot-infobox'
export const MESSAGE_ID = 'idabot-message'
export const LOADER_ID = 'idabot-loading'
export const START_BUTTON_ID = 'idabot-start'
export const REFRESH_BUTTON_ID = 'idabot-refresh'
export const FOOTER_ID = 'infobox_footer'

export const INFOBOX_CHECK_CONNECTION = 'Prüfe Verbindung zum Pressearchiv...'
export const INFOBOX_START_SEARCH = 'Starte Suche...'
export const INFOBOX_CANT_EXTRACT = 'Beim Extrahieren der Artikeldaten trat ein Fehler auf.'

export const INFOBOX_HTML =
`
<link rel="stylesheet" href="${browser.extension.getURL('css/bulma.min.css')}">
</style>
<div class="columns" id="${INFOBOX_ID}">
    <div class="column">
        <div class="card has-text-left" id="infobox">

            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img src="${browser.extension.getURL('icons/voebbot48.png')}" alt="Roboter">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">IDA-BOT</p>
                        <p class="subtitle is-6">
                            <a href="mailto:${mailContactArchive}?subject=[IDA-Bot] Frage">${mailContactArchive}</a>
                        </p>
                    </div>
                </div>

                <div id="${MESSAGE_ID}" class="content">
                </div>

                <footer id="${FOOTER_ID}">

                    <progress id="${LOADER_ID}" class="progress is-primary" max="100" style="display: none;">15%</progress>

                    <button id="${START_BUTTON_ID}" class="button is-primary is-large" style="display: none;">Volltext suchen</button>

                    <button id="${REFRESH_BUTTON_ID}" class="button is-primary is-large" onClick="window.location.reload();" style="display: none;">Seite aktualisieren</button>

                </footer>

            </div>
        </div>
    </div>
</div>
`
export const INFOBOX_MSG_AVAILABLE = `
IDA-Bot kann auf dieser Website für Sie automatisch nach dem Volltext und der PDF dieses Artikels suchen.`

export const INFOBOX_MSG_NOT_REACHABLE = `
IDA-BOT kann das Pressearchiv nicht erreichen. Tun Sie folgendes, um nach dem Volltext suchen zu können:<br />
<ol type="1">
  <li>Verbinden Sie sich mit dem internem LAN, -WLAN oder VPN.</li>
  <li>Aktualisieren Sie diese Seite.</li>
</ol>`

const articleURL = new URL(window.location.href)

export const INFOBOX_MSG_FAILED = `
Der Artikel konnte leider nicht gefunden werden. Das kann verschiedene Gründe haben.

<ul>
  <li>Anriss oder Titel können sich von der Druckausgabe unterscheiden.</li>
  <li>Möglicherweise ist der Artikel online-exklusiv.</li>
  <li>Artikel aus der gedruckten Ausgabe sind ggf. noch nicht verfügbar.</li>
</ul>
&rarr; Nutzen Sie das offene Tab, um nach Stichworten zu suchen. <br />
&rarr; Fragen Sie die Presse-Expert*innen nach dem Artikel: <a href="mailto:${mailContactArchive}?subject=Presserecherche: Artikel auf ${articleURL.hostname.replace('www.', '')}&body=Hallo, %0D%0A%0D%0A könnten Sie mir bitte den folgenden Artikel beschaffen? %0D%0A%0D%0A URL: ${articleURL} %0D%0A%0D%0A Vielen Dank.">Mail</a>. 
`
