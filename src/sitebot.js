import {
  INFOBOX_HTML,
  INFOBOX_MSG_AVAILABLE, INFOBOX_MSG_NOT_REACHABLE, INFOBOX_MSG_FAILED,
  MESSAGE_ID, LOADER_ID, START_BUTTON_ID, REFRESH_BUTTON_ID, INFOBOX_ID,
  INFOBOX_CHECK_CONNECTION, INFOBOX_START_SEARCH, INFOBOX_CANT_EXTRACT,
  ARTICLE_FULLTEXT
} from './ui.js'
import {
  DEFAULT_URL, FAILED_MESSAGE, INIT_MESSAGE, STATUS_MESSAGE, SUCCES_MESSAGE,
  PORT_NAME, ERROR_UNKNOWN_TYPE, INFO_FAILED_TO_FIND_CONTENT, FALLBACK_URL, FALLBACK_SOURCE, DEFAULT_SOURCE,
  HAS_FALLBACK
} from './const.js'
import { handleIsReachable } from './utils.js'

class SiteBot {
  constructor (site, root, domain = null) {
    this.site = site
    this.site.source = DEFAULT_SOURCE
    this.root = root
    this.domain = domain
    this.onDisconnect = this.onDisconnect.bind(this)
    this.onMessage = this.onMessage.bind(this)
  }

  start () {
    if (!this.hasPaywall()) {
      return
    }

    if (this.site.start) {
      this.site.start(this.root, this.getPaywall())
    }
    this.showInfoBox()
    this.showUpdate(INFOBOX_CHECK_CONNECTION)

    handleIsReachable(window, DEFAULT_URL, (reachable) => {
      this.hideLoader()
      if (reachable) {
        this.offerStart()
      } else if (HAS_FALLBACK) {
        // Fallback
        handleIsReachable(window, FALLBACK_URL, (fallbackReachable) => {
          if (fallbackReachable) {
            this.offerStart(true)
          }else{
            this.showNotReachable()
          }
        })
      }else{
        this.showNotReachable()
      }
    })
  }

  showNotReachable() {
    this.updateInfoBox(INFOBOX_MSG_NOT_REACHABLE)
    this.showButton(REFRESH_BUTTON_ID)
  }

  offerStart(useFallback = false) {
    this.updateInfoBox(INFOBOX_MSG_AVAILABLE)
    this.showButton(START_BUTTON_ID)
    const startButton = this.shadowRoot.getElementById(START_BUTTON_ID)
    startButton.addEventListener('click', (event) => {
      this.hideButton(START_BUTTON_ID)
      event.preventDefault()
      this.startBot(useFallback)
      this.updateInfoBox(INFOBOX_START_SEARCH, true, true)
      this.showLoader()
    })
  }
  startBot (useFallback) {
    let articleInfo
    try {
      articleInfo = this.collectArticleInfo()
    } catch (e) {
      this.showUpdate(INFOBOX_CANT_EXTRACT)
      return
    }
    let source
    if (useFallback){
      this.site.source = FALLBACK_SOURCE
    }    
    this.connectPort()
    this.postMessage({
      type: INIT_MESSAGE,
      source: this.site.source,
      sourceParams: this.site.sourceParams,
      domain: this.domain,
      articleInfo: articleInfo,
      site: this.site
    })
  }

  getPaywall () {
    return this.root.querySelector(this.site.selectors.paywall)
  }
  hasAdditionalPaywallTest () {
    return "additionalPaywallTest" in this.site === true
  }
  getAdditionalPaywallTest () {
    return this.site.additionalPaywallTest
  }
  hasPaywall () {
    if(this.hasAdditionalPaywallTest()){
      const additionalTest = this.getAdditionalPaywallTest()
      return ((this.getPaywall() !== null) && (additionalTest() !== false))
    }
    return this.getPaywall() !== null
  }

  hidePaywall () {
    this.getPaywall().style.display = 'none'
  }

  showPaywall () {
    this.getPaywall().style.display = 'block'
  }

  hideButton (buttonID) {
    this.shadowRoot.getElementById(buttonID).style.display = 'none'
  }

  showButton (buttonID) {
    this.shadowRoot.getElementById(buttonID).style.display = 'block'
  }

  getMainContentArea () {
    return this.root.querySelector(this.site.selectors.main)
  }

  showInfoBox () {
    this.hidePaywall()
    const shadowHost = document.createElement('p')
    this.getMainContentArea().appendChild(shadowHost)
    this.shadowRoot = shadowHost.attachShadow({ mode: 'closed' })
    this.shadowRoot.innerHTML = INFOBOX_HTML
  }

  hideInfoBox () {
    this.shadowRoot.innerHTML = ''
  }

  updateInfoBox (update, onlyText = false, showLoader = false) {
    if (showLoader) { this.showLoader() }
    if (onlyText) {
      this.shadowRoot.querySelector(`#${MESSAGE_ID}`).innerText = update
    } else {
      this.shadowRoot.querySelector(`#${MESSAGE_ID}`).innerHTML = update
    }
  }

  showUpdate (text) {
    this.updateInfoBox(text, true)
  }

  hideLoader () {
    this.shadowRoot.getElementById(LOADER_ID).style.display = 'none'
  }

  showLoader () {
    this.shadowRoot.getElementById(LOADER_ID).style.display = 'block'
  }

  collectArticleInfo () {
    const articleInfo = {}
    for (const key in this.site.selectors) {
      if (this.site.selectors[key]) {
        const selector = this.site.selectors[key]
        if (typeof selector === 'function') {
          articleInfo[key] = selector(this.root)
        } else {
          const parts = this.site.selectors[key].split('@')
          const result = this.root.querySelector(parts[0])
          if (result === null) {
            articleInfo[key] = ''
            continue
          }
          if (parts[1]) {
            articleInfo[key] = result.attributes[parts[1]].value.trim()
          } else {
            articleInfo[key] = result.textContent.trim()
          }
        }
      }
    }
    let q = articleInfo.query
    // remove some special chars
    q = q.replace(/[!/&]/g, '')
    // PAN-only: replace newlines, dash with space
    q = q.replace(/[\n-]/g, ' ')
    // remove non-leading/trailing quotes 
    q = q.replace(/(.)"(.)/g, '$1$2')
    articleInfo.query = q
    return articleInfo
  }

  connectPort () {
    this.port = browser.runtime.connect({ name: PORT_NAME })
    this.port.onMessage.addListener(this.onMessage)
    this.port.onDisconnect.addListener(this.onDisconnect)
    return this.port
  }

  postMessage (message) {
    this.port.postMessage(message)
  }

  onDisconnect () {
    this.port.onMessage.removeListener(this.onMessage)
    this.port.onDisconnect.removeListener(this.onDisconnect)
  }

  onMessage (event) {
    if (event.type === STATUS_MESSAGE) {
      if (event.message) {
        this.showUpdate(event.message)
      }
      return
    }

    this.hideLoader()

    if (event.type === FAILED_MESSAGE) {
      this.fail()
      // Nicht gefundenen Artikel anders als Fehler behandeln
      if (!event.content.includes(INFO_FAILED_TO_FIND_CONTENT)) {
        console.error('failed!', event.content)
      }
      return
    }

    if (event.type === SUCCES_MESSAGE) {
      this.showArticle(event.content)
      return
    }

    throw new Error(ERROR_UNKNOWN_TYPE)
  }

  fail () {
    this.updateInfoBox(INFOBOX_MSG_FAILED)
    this.showPaywall()
  }
  
  showArticle (article) { 
    const content = article[0]
    this.shadowRoot.innerHTML = ARTICLE_FULLTEXT.replace(/{{pdfURL}}/g, content.pdfURL).replace('{{text}}', content.text)
  }
}

export default SiteBot
