const extractQuery = (node) => `"${node.innerText.split(' ').slice(2, 10).join(' ')}"`
export default {
  'www.zeit.de': {
    selectors: {
      // Aus welchem Element des Textes soll extrahiert werden, um in Archiv danach zu suchen?
      query: () => {
        return extractQuery(document.querySelector('.article__item .paragraph'))
      },
      // Wo ist die Paywall?
      paywall: '.gate.article__item',
      // Worunter ist der Artikeltext versammelt?
      main: '.article-page .article__item',
    },
    // Sind vor weiteren Schritten vorbereitende Schritte nötig, z. B. ein Blurring zu entfernen?
    start: (root) => {
      root.querySelector('.paragraph--faded').classList.remove('paragraph--faded')

    },
    sourceParams: {
      // Parameter aus Archiv: Quelle, bekannte Operatoren sind erlaubt (&, /,...)
      dbShortcut: 'ZEIT / Zeit Hamburg / Zeit-Magazin'
    }
  },
  'www.sueddeutsche.de': {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector('.sz-article-body__paragraph'))
      },
      paywall: 'offer-page',
      main: "div[itemprop='articleBody']",
    },
    start: (root) => {
      const p = root.querySelector('.sz-article-body__paragraph--reduced')
      if (p) {
        p.className = 'sz-article-body__paragraph'
      }
    },
    sourceParams: {
      dbShortcut: 'Süddeu*'
    }
  },
  'www.stuttgarter-zeitung.de': {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector('.brickgroup .mod-article p:not(.box-lead)'))
      },
      paywall: '.c1-offers-target',
      main: ".brickgroup .mod-article p:not(.box-lead)",
    },
    start: (root) => {
      const bricks = [root.querySelector('.mod-header-article-overlay-wrap'),
      root.querySelector('.statichtmlbrick')]
      bricks.forEach((ele, i) => ele ? ele.remove() : true)
    },
    sourceParams: {
      dbShortcut: 'Stuttgarter Zeitung'
    }
  },
  'www.welt.de': {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector('.c-article-text p'))
      },
      paywall: '.contains_walled_content',
      main: '.c-article-text'
    },
    sourceParams: {
      dbShortcut: 'Welt / Welt am *'
    }
  },
  'bnn.de': {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector('.article__body p'))
      },
      paywall: '.article__paywall',
      main: '.article__body'
    },
    start: (root) => {
      root.querySelector('.article__paywall.paywall').classList.remove('paywall')
    },
    sourceParams: {
      dbShortcut: 'Badische Neues*'
    }
  },
  'www.faz.net': {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector('.atc-Text p'))
      },
      paywall: '.js-atc-ContainerPaywall',
      main: '.atc-Text'
    },
    start: (root) => {
      root.querySelector('section.js-atc-ContainerPaywall ').classList.remove('atc-ContainerPaywall')
    },
    sourceParams: {
      dbShortcut: 'Frankfurter Allgemeine*'
    }
  },
  'zeitung.faz.net': {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector('.article__container.article__container--medium p'))
      },
      paywall: '.red-carpet',
      main: '.article__container.article__container--medium'
    },
    start: (root) => {
      root.querySelector('.fade-out-to-bottom').classList.remove('fade-out-to-bottom');
    },
    sourceParams: {
      dbShortcut: 'Frankfurter Allgemeine*'
    }
  },
  'www.cicero.de': {
    selectors: {
      query: (root) => {
        return extractQuery(root.querySelector('.field-name-field-cc-body'))
      },
      main: '.field-name-field-cc-body',
      paywall: '#plenigo-paywall-start',
      loader: '.paywall-fadeout'
    },
    start: (root) => {
      root.querySelector('.paywall-fadeout').classList.remove('paywall-fadeout')
      root.querySelector('.paywall-fader').classList.remove('paywall-fader')
      const ele = root.querySelector('.author-box--newsletter')
      if (ele) {
        ele.remove()
      }
    },
    waitOnLoad: true,
    sourceParams: {
      dbShortcut: 'Cicero'
    }
  },
}
