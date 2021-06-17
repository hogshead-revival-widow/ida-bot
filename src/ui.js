const mailContactArchive = 'idaBotHelp@gmail.com'
const articleURL = new URL(window.location.href)

// Testbetrieb

const CONTACT_TEST_RUN =  `
<aside class="card-header">
<p class="card-header-title"><a href="mailto:idaBotHelp@gmail.com?subject=[IDA-Bot-Testbetrieb] [${browser.runtime.getManifest().version}] Problem auf [${articleURL.hostname.replace('www.', '')}]&body=Beabsichtigter Aufruf von: ${articleURL} %0D%0A%0D%0A Das ging schief: %0D%0A%0D%0A ggf. Besonderheiten: ">[Testbetrieb] Funktioniert nicht, wie erwartet?</a></p>
    <a href="mailto:idaBotHelp@gmail.com?subject=[IDA-Bot-Testbetrieb] [${browser.runtime.getManifest().version}] Problem auf [${articleURL.hostname.replace('www.', '')}]&body=Beabsichtigter Aufruf von: ${articleURL} %0D%0A%0D%0A Das habe ich erwartet: %0D%0A%0D%0A Das ging schief: %0D%0A%0D%0A ggf. Besonderheiten: " class="card-header-icon is-size-2">
        <span class="icon is-size-2"> 
            <img src="${browser.extension.getURL('icons/mail.svg')}" alt="Mail">
        </span> 
    </a>
</aside>`

// Status'

export const MSG_WAIT = 'Warte auf Rückmeldung...';
export const MSG_LOGIN_SELECTION = 'Archiv wird ausgewählt...'
export const MSG_LOGIN_ACCESS = 'Konto wird eingeloggt...'
export const MSG_START_SEARCH = 'Suche wird durchgeführt...'
export const MSG_ARTICLE = 'Artikel wird aufgerufen...'
export const MSG_INTERACTION_SSO = 'Bitte gehen Sie zum  geöffneten Tab und loggen sich dort ein. Tipp: Wenn Sie das Häkchen dort setzen, werden Sie erst in 30 Tagen wieder gefragt.';

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
    <div class="card has-text-left" id="infobox" id="${INFOBOX_ID}" style="min-width: 100%;">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img src="${browser.extension.getURL('icons/voebbot48.png')}" alt="Roboter">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">IDA-Bot</p>
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
        ${CONTACT_TEST_RUN}
        </div>`
export const INFOBOX_MSG_AVAILABLE = `
IDA-Bot kann auf dieser Website für Sie automatisch nach dem Volltext und der PDF dieses Artikels suchen.`

export const INFOBOX_MSG_NOT_REACHABLE = `
IDA-Bot kann das Pressearchiv nicht erreichen. Tun Sie folgendes, um nach dem Volltext suchen zu können:<br />
<ol type="1">
  <li>Verbinden Sie sich mit dem Archiv-LAN, -WLAN oder VPN.</li>
  <li>Aktualisieren Sie diese Seite.</li>
</ol>`

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

// Volltextanzeige

export const ARTICLE_FULLTEXT_ID = 'idabot-volltext'

export const ARTICLE_FULLTEXT = `

<link rel="stylesheet" href="${browser.extension.getURL('css/bulma.min.css')}">

<div class="card" style="margin-bottom: 2em;" >
  
  <header class="card-header">
    <p class="card-header-title">
    Pressearchiv
    </p>
  </header>

  <header class="card-header">
    <p class="card-header-title">
    <a href="{{pdfURL}}" target="_blank">Artikel als PDF (Link)</a>
    </p>
    <a href="{{pdfURL}}" target="_blank" class="card-header-icon is-size-2">
        <span class="icon"> 
            <img src="${browser.extension.getURL('icons/pdf.svg')}" alt="PDF">
        </span> 
    </a>
  </header>

  ${CONTACT_TEST_RUN}
  
  <div class="card-content">
    <div class="content">
      {{text}}
    </div>
  </div>

  <footer class="card-header" style="padding-bottom: 1em;">
  <p class="card-header-title"><small>{{copyright}}</small></p>
  </footer>

 <footer class="card-header">
    <p class="card-header-title">
        <a href="{{pdfURL}}" target="_blank">Artikel als PDF (Link)</a>
    </p>
    <a href="{{pdfURL}}" target="_blank" class="card-header-icon is-size-2">
      <span class="icon"> 
          <img src="${browser.extension.getURL('icons/pdf.svg')}" alt="PDF">
      </span> 
    </a>
</footer>

</div>
`
