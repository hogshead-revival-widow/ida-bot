const extractQuery = (node) => `"${node.innerText.split(' ').slice(2, 10).join(' ')}"`
export default {
  'www.zeit.de': {
    selectors: {
      // query: ".article-heading__title, .article-header__title, .headline__title",
      query: () => {
        return extractQuery(document.querySelector('.article__item .paragraph'))
      },
      edition: '.zplus-badge__media-item@alt',
      date: '.metadata__source.encoded-date, time',
      paywall: '.gate.article__item',
      main: '.article-page',
      mimic: '.article-page .paragraph'
    },
    start: (root) => {
      root.querySelector('.article-page .paragraph')
    },
    source: 'pan',
    sourceParams: {
      dbShortcut: 'ZEIT / Zeit Hamburg / Zeit-Magazin'
    }
  },
  'www.welt.de': {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector('.c-article-text p'))
      },
      date: 'time',
      paywall: '.contains_walled_content',
      main: '.c-article-text'
    },
    start: (root) => {
      root.querySelector('.c-page-container.c-la-loading')
    },
    source: 'pan',
    sourceParams: {
      dbShortcut: 'Welt / Welt am *'
    }
  },
  'www.sueddeutsche.de': {
    selectors: {
      // query: "article > header > h2 > span:last-child",
      query: () => {
        return extractQuery(document.querySelector('.sz-article-body__paragraph'))
      },
      date: 'time',
      paywall: 'offer-page',
      main: "div[itemprop='articleBody']",
      mimic: '.sz-article-body__paragraph'
    },
    start: (root) => {
      const p = root.querySelector('.sz-article-body__paragraph--reduced')
      if (p) {
        p.className = 'sz-article-body__paragraph'
      }
    },
    paragraphStyle: {
      style: 'margin-bottom: 1rem'
    },
    source: 'pan',
    sourceParams: {
      dbShortcut: 'Süddeu*'
    }
  }
}
