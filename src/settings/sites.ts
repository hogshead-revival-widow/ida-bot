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
            paywall: [
                'offer-page:not([contentproduct^="projekte"])',
                "div[class^='offerpage]",
            ],
            main: ["div[itemprop='articleBody']", '.offer-page-wrapper'],
        },
        sourceNames: [
            'Süddeutsche Zeitung (SZ)',
            'Süddeutsche Zeitung',
            'Süddeutsche online',
            'Süddeutsche Zeitung Magazin (SZ Magazin)',
            'Süddeutsche Zeitung Beilage',
            'Süddeutsche Zeitung Magazin',
        ],
    },

    {
        match: '*://www.zeit.de/*',
        waitOnLoad: true,
        prepareSite: (root) =>
            root
                .querySelector('.paragraph--faded')
                ?.classList.remove('paragraph--faded'),
        selectors: {
            query: [
                //'.figure__text',
                '.article__item > .paragraph:nth-child(3)',
                '.article__item > .paragraph:nth-child(2)',
                '.article__item > .paragraph',
            ],
            paywall: ['.gate', '.gate.article__item'],
            main: ['.article-page .article__item'],
        },
        sourceNames: [
            'Die Zeit',
            'Die Zeit (magazin)',
            'Die Zeit (Zeit)',
            'Zeit Hamburg',
            'ZEIT ONLINE',
            'Christ & Welt',
            'ZEIT Geschichte',
            'ZEIT Literatur',
            'ZEIT Verbrechen',
        ],
    },
    {
        match: '*://www.brandeins.de/*',
        selectors: {
            query: ['.title-text'],
            paywall: ['[id^=paywall]'],
            main: ['.textblock.container > div > div', '.article-author'],
        },
        sourceNames: ['brand eins'],
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
            'Frankfurter Allgemeine Zeitung (FAZ)',
            'Frankfurter Allgemeine Zeitung',
            'Frankfurter Allgemeine Sonntagszeitung',
            'Frankfurter Allgemeine Sonntagszeitung (FAS)',
            'Frankfurter Allgemeine Magazin',
            'Frankfurter Allgemeine Zeitung - Berliner Seiten',
            'Frankfurter Allgemeine Sonntagszeitung (Regionalausgabe)',
        ],
    },

    {
        match: '*://www.bild.de/*',
        waitOnLoad: true,
        selectors: {
            query: [
                '.article-body > div > p:nth-child(1)',
                '.article-body > div > p:nth-child(2)',
                '.headline',
                '.article-header__headline',
            ],
            paywall: ['.conversion', '.offer-module__ps', '.offer-module__red'],
            main: ['.conversion-page', '.offer-module'],
        },
        sourceNames: [
            'Bild online',
            'Bild',
            'Bild am Sonntag (BamS)',
            'Bild Stuttgart',
            'Bild Frankfurt Rhein-Main (BILD-F)',
            'Bild am Sonntag / Hamburg',
            'Bild Frankfurt Rhein-Main',
            'Bild Berlin',
            'Bild am Sonntag',
            'Bild Hamburg',
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
            'Welt am Sonntag Samstagsausgabe',
            'WELTplus',
            'Welt online',
            'Welt am Sonntag (WamS)',
            'Die Welt',
            'Welt am Sonntag / Hamburg',
            'Welt am Sonntag',
            'Welt am Sonntag / NRW',
            'Welt am Sonntag / Bayern',
            'Die Welt / Hamburg',
            'Die Welt / Berlin',
            'Welt am Sonntag Samstagsausgabe / Hamburg',
            'Welt am Sonntag Samstagsausgabe / NRW',
            'Welt News',
        ],
    },

    /*
        Regional
    */

    {
        match: '*://www.rhein-zeitung.de/*',
        selectors: {
            query: ['.articlebody__teasertext'],
            paywall: ['.mrvpaywall__layer'],
            main: ['.articlebody__mainarticle'],
        },

        sourceNames: [
            'Rhein-Zeitung / Koblenz (RZG)',
            'Rhein-Zeitung / Koblenz',
            'Rhein-Zeitung / Westerwaldkreis (RZWW)',
            'Rhein-Zeitung',
            'Rhein-Zeitung / Kreis Neuwied (RZLNW)',
            'Rhein-Zeitung / Bad Kreuznach (Ost) (RZBKO)',
            'Rhein-Zeitung / Kreis Altenkirchen Betzdorf (RZAKB)',
            'Rhein-Zeitung / Kreis Altenkirchen Betzdorf',
            'Rhein-Zeitung / Bad Kreuznach (Ost)',
            'Rhein-Zeitung / Kreis Neuwied',
            'Rhein-Zeitung / Rhein-Lahn Kreis (West) (RZRLW)',
            'Rhein-Zeitung / Rhein-Lahn Kreis (Ost) (RZRLO)',
            'Rhein-Zeitung / Kreis Cochem-Zell (RZCOC)',
            'Rhein-Zeitung / Bad Neuenahr-Ahrweiler (RZBNA)',
            'Rhein-Zeitung / Rhein-Hunsrück Kreis (RZRH)',
            'Rhein-Zeitung / Bad Kreuznach (West)',
            'Rhein-Zeitung / Rhein-Lahn Kreis (Ost)',
            'Rhein-Zeitung / Rhein-Lahn Kreis (West)',
            'Rhein-Zeitung / Kreis Cochem-Zell',
            'Rhein-Zeitung / Bad Neuenahr-Ahrweiler',
            'Rhein-Zeitung / Andernach Mayen',
        ],
    },

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
        sourceNames: [
            'Badische Zeitung',
            'Badische Zeitung / Freiburg',
            'Badische Zeitung / Offenburg',
        ],
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
            'Badische Neueste Nachrichten / Karlsruhe',
            'Badische Neueste Nachrichten / Mittelbaden',
            'Badische Neueste Nachrichten / Baden-Baden',
            'Badische Neueste Nachrichten / Pforzheim',
            'Badische Neueste Nachrichten (BNN)',
            'Badische Neueste Nachrichten',
            'Badische Neueste Nachrichten / Ettlingen',
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
            'Trierischer Volksfreund / Zeitung für Trier und das Trierer Land (TV)',
            'Trierischer Volksfreund / Bitburg-Prüm (TVBP)',
            'Trierischer Volksfreund / Vulkaneifel (TVV)',
        ],
    },

    {
        match: '*://www.swp.de/*',
        selectors: {
            query: ['.article-text'],
            paywall: ['.paywall_container'],
            main: ['.article-content'],
        },

        sourceNames: [
            'Südwest Presse Ulm',
            'Südwest Presse / Neckar-Chronik',
            'Südwest Presse',
        ],
    },
];

export default sites;
