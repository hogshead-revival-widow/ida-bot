/*
    Vgl. `examples/sites.ts` for eine Beispiel-Seite.
*/

const sites: Site[] = [
    /*
        Überregional
    */

    {
        match: '*://www.sueddeutsche.de/*',
        selectors: {
            query: [
                '.sz-article-body__paragraph--reduced',
                '.sz-article-body__paragraph',
                'div:has(.publishdate-container) > p', // super scroller (projekte/)
            ],
            paywall: ['offer-page', "div[class^='offerpage]"],
            main: ["div[itemprop='articleBody']", '.offer-page-wrapper'],
        },
        sourceNames: [
            'Süddeutsche Zeitung',
            'Süddeutsche online',
            'Süddeutsche Zeitung Magazin',
        ],
    },

    {
        match: '*://www.zeit.de/*',
        prepareSite: (root) =>
            root
                .querySelector('.paragraph--faded')
                ?.classList.remove('paragraph--faded'),
        selectors: {
            query: [
                '.article__item > .paragraph:nth-child(3)',
                '.article__item > .paragraph:nth-child(2)',
                '.article__item > .paragraph',
            ],
            paywall: ['.gate.article__item'],
            main: ['.article-page .article__item'],
        },
        sourceNames: ['Die Zeit', 'Die Zeit magazin', 'Christ & Welt'],
    },

    {
        match: '*://www.faz.net/*',
        selectors: {
            query: ['.atc-Text p'],
            paywall: ['.js-atc-ContainerPaywall'],
            main: ['.atc-Text'],
        },
        prepareSite: (root) =>
            root
                .querySelector('section.js-atc-ContainerPaywall ')
                ?.classList.remove('atc-ContainerPaywall'),
        sourceNames: [
            'Frankfurter Allgemeine Zeitung',
            'Frankfurter Allgemeine Sonntagszeitung',
            'Frankfurter Allgemeine Magazin',
            'Frankfurter Allgemeine Zeitung (Regionalausgabe)',
        ],
    },

    {
        match: '*://www.bild.de/*',
        waitOnLoad: true,
        selectors: {
            query: [
                '.article-body > div > p:nth-child(2)',
                '.article-body > div > p:nth-child(1)',
                '.headline',
                '.article-header__headline',
            ],
            paywall: ['.conversion', '.offer-module__ps', '.offer-module__red'],
            main: ['.conversion-page', '.offer-module'],
        },
        sourceNames: [
            'Bild',
            'Bild online',
            'Bild Stuttgart',
            'Bild am Sonntag',
            'Bild Frankfurt Rhein-Main',
            'Bild am Sonntag / Hamburg',
        ],
    },

    {
        match: '*://www.welt.de/*',
        waitOnLoad: true,
        selectors: {
            query: ['.c-article-text', '.c-summary__intro'],
            paywall: ['.contains_walled_content'],
            main: ['.c-content-container'],
        },
        sourceNames: [
            'Die Welt',
            'Welt am Sonntag',
            'Welt am Sonntag / Hamburg',
            'Welt am Sonntag / NRW',
            'Welt am Sonntag / Bayern',
        ],
    },
    /*
        Regional
    */

    {
        match: '*://www.stuttgarter-nachrichten.de/*',
        waitOnLoad: true,
        selectors: {
            query: ['.article-body > p'],
            paywall: ['.paywall-container-wrap'],
            main: ['.article-body > p'],
        },
        sourceNames: ['Stuttgarter Nachrichten', 'Stuttgarter Zeitung'],
    },

    {
        match: '*://www.stuttgarter-zeitung.de/*',
        waitOnLoad: true,
        selectors: {
            query: ['.introText > p'],
            paywall: ['.paywall-container-wrap'],
            main: ['.sharewrapper'],
        },
        sourceNames: ['Stuttgarter Zeitung', 'Stuttgarter Nachrichten'],
    },

    {
        match: '*://www.badische-zeitung.de/*',
        selectors: {
            query: ['.freemium__preview'],
            paywall: ['.freemium'],
            main: ['.freemium__preview'],
        },
        sourceNames: ['Badische Zeitung', 'Badische Zeitung / Freiburg'],
    },

    {
        match: '*://bnn.de/*',
        selectors: {
            query: ['.figure__caption-text', '.intro', 'immersive-header__intro'],
            paywall: ['.article__paywall, .paywall'],
            main: ['.article__body, .longread-content'],
        },
        prepareSite: (root) =>
            root
                .querySelector('.article__paywall.paywall')
                ?.classList.remove('paywall'),
        sourceNames: [
            'Badische Neueste Nachrichten / Mittelbaden',
            'Badische Neueste Nachrichten / Pforzheim',
            'Badische Neueste Nachrichten / Baden-Baden',
        ],
    },

    {
        match: '*://www.mannheimer-morgen.de/*',
        selectors: {
            query: ['.article-body-default__content'],
            paywall: ['.paywall.paywall--delimiter'],
            main: ['.article-body-default__content'],
        },
        sourceNames: ['Mannheimer Morgen', 'Mannheimer Morgen / Neckar-Bergstraße'],
    },

    {
        match: '*://www.fnweb.de/*',
        selectors: {
            query: ['.article-body-default__content'],
            paywall: ['.paywall.paywall--delimiter'],
            main: ['.article-body-default__content'],
        },
        sourceNames: ['Fränkische Nachrichten'],
    },

    {
        match: '*://www.volksfreund.de/*',
        waitOnLoad: true,
        selectors: {
            query: ['.park-article__body > p > strong'],
            paywall: ['.park-widget'],
            main: ['.park-article'],
        },
        prepareSite: (root) => {
            root.querySelector('.park-article--reduced')?.classList.remove(
                'park-article--reduced'
            );
        },
        sourceNames: [
            'Trierischer Volksfreund / Zeitung für Trier und das Trierer Land',
            'Trierischer Volksfreund / Bitburg-Prüm',
            'Trierischer Volksfreund / Vulkaneifel',
        ],
    },

    {
        match: '*://www.swp.de/*',
        selectors: {
            query: ['.article-text'],
            paywall: ['.paywall_container'],
            main: ['.article-content'],
        },

        sourceNames: ['Südwest Presse / Neckar-Chronik', 'Südwest Presse Ulm'],
    },
];

export default sites;