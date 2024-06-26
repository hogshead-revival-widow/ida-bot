// import source from 'src/settings/source.js';

const szSourceNames: Site['sourceNames'] = [
    'Süddeutsche Zeitung (SZ)',
    'Süddeutsche Zeitung',
    'Süddeutsche online',
    'Süddeutsche Zeitung Magazin (SZ Magazin)',
    'Süddeutsche Zeitung Beilage',
    'Süddeutsche Zeitung Magazin',
];

const stN: Site = {
    match: '*://www.stuttgarter-nachrichten.de/*',
    waitOnLoad: true,
    selectors: {
        query: [
            '.article-body > p',
            '.intro-text',
            'head > title',
            'figcaption',
            '.article-kicker',
        ],
        paywall: [
            '.mod-paywall:not([style*="display: none"])',
            '.paywall-container-wrap:not([style*="display: none"])',
        ],
        date: [
            (root) =>
                root
                    .querySelector('span[itemprop="datePublished"]')
                    ?.getAttribute('content'),
        ],
        author: [
            (root) =>
                root
                    .querySelector('a[itemprop="author"]') // @ts-ignore
                    ?.innerText?.split(/\s+/)
                    ?.join(' '),
            (root) =>
                root
                    .querySelector('a.author') // @ts-ignore
                    ?.innerText?.split(/\s+/)
                    ?.join(' '),
        ],
        main: ['.article-body > p'],
    },
    queryMakerOptions: {
        ignoreEndWords: 3,
        selectorStrategy: 'USE_ALL_VALID_WITH_OR',
    },
    sourceNames: [
        'Stuttgarter Nachrichten',
        'Schwarzwälder Bote (SBOT)',
        'Schwarzwälder Bote Online (SBOTO)',
        'Stuttgarter Zeitung',
    ],
};

const sites: Site[] = [
    /*
        Überregional
    */

    {
        match: '*://www.sueddeutsche.de/*',
        waitOnLoad: true,
        selectors: {
            query: [
                '.teaser', // /projekte
                '.headline', // /projekte
                '.sz-article-body__paragraph--reduced',
                '.sz-article-body__paragraph',
                'div:has(.publishdate-container) > p',
                '.text.text-wide',
                '[data-manual="teaserText"]',
            ],
            date: [
                (root) =>
                    root
                        .querySelector('[id ^="article"] time')
                        ?.getAttribute('datetime'),
            ],

            author: [
                (root) =>
                    Array.from(root.querySelectorAll('[data-manual="author"] a'))
                        .map(
                            (a) =>
                                ` ( ${(a as HTMLElement).innerText
                                    .split(/\s+/)
                                    .join(' ')} )`
                        )
                        .join(' AND '),
                // /projekte
                (root) =>
                    root
                        .querySelector('.author a') // @ts-ignore
                        ?.innerText?.split(/\s+/)
                        ?.join(' '),
            ],
            paywall: [
                '#sz-paywall',
                'offer-page:not([contentproduct^="projekte"])',
                "div[class^='offerpage]",
            ],
            main: ["div[itemprop='articleBody']", '.offer-page-wrapper'],
        },
        queryMakerOptions: {
            selectorStrategy: 'USE_ALL_VALID_WITH_OR',
            queryTargetWords: 5,
        },
        sourceNames: szSourceNames,
    },

    /*
        #todo: veröffentlichen, wenn noch weitere quellen dazu gekommen sind (reaktivierungsbedarf)
        {
            match: '*://sz-magazin.sueddeutsche.de/*',
            prepareSite: (root) =>
                root.querySelector('.paragraph')?.classList.remove('paragraph--reduced'),
            selectors: {
                query: ['.articlemain__content'],
                paywall: ["div[class^='offerpage']"],
                main: ['.articlemain__content'],
            },
            sourceNames: szSourceNames,
        },

    */

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

            date: [
                (root) => root.querySelector('article time')?.getAttribute('datetime'),
            ],
            paywall: ['#paywall', '.gate', '.gate.article__item'],
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
            query: ['.body-elements__paragraph'],
            paywall: ['.paywall', '.regwall'],
            main: ['.body-elements__paragraph'],
            date: [(root) => root.querySelector('time')?.getAttribute('datetime')],
        },
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
                '.headline',
                '.article-header__headline',
                '.document-title__kicker',
                '.document-title__headline',
                '.document-title',
                'header > title',
            ],
            // es können jetzt auch Autor:innen zur Suche herangezogen werden
            // diese werden, wenn vorhanden, als Muss-Suchkriterium ergänzt
            // es werden alle hier angegebenen Extraktoren genutzt,
            // deren Ergebnisse werden mit verundet
            // in diesem Beispiel wird nur ein Autorfeld extrahiert,
            // wird ein Name gefunden, werden alle Whitespaces
            // in ein einfaches Leerzeichen überführt,
            // in diesem Beispiel würde aus dem Autor "Oskar   Müller" => "Oskar Müller"
            // und es würde an den finalen Query so angehängt werden: '(...query) AND ( (Oskar Müller) )'
            author: [
                (root) =>
                    root
                        .querySelector('.article_author') // @ts-ignore
                        ?.innerText?.split(/\s+/)
                        ?.join(' '),
                (root) =>
                    root
                        .querySelector('.author__name') // @ts-ignore
                        ?.innerText?.split(/\s+/)
                        ?.join(' '),
            ],
            date: [
                (root) =>
                    root.querySelector('.main-content time')?.getAttribute('datetime'),
            ],
            paywall: ['.conversion', '.offer-module__ps', '.offer-module__red'],
            main: ['.conversion-page', '.offer-module'],
        },
        queryMakerOptions: {
            // vgl.: settings/config.json für Standardeinstellungen
            // diese können quellspezifisch überschrieben werden
            // dazu wie in diesem Beispiel die Sonderregeln für diese Quelle angeben
            ignoreStartWords: 0, // n erste Wörter ignorieren (oft Sondersatz)
            ignoreEndWords: 0, // diese n letzten Wörter (oft abgekürzt) ignorieren
            queryTargetWords: 3, /// wie viele soll Wörter soll der Query möglichst haben? höhere Werte verringern false positives, erhöhen aber false negatives
            toleranceDays: 2, // wie viele Tage um das +- Datum soll gesucht werden? (wenn date oben  in selectors gesetzt wurde); kleine Zahl ergibt Sinn bei Quellen, die idR nur aktuell interessieren
            selectorStrategy: 'USE_ALL_VALID_WITH_OR', // soll nur der erste Selektor, der einen Text findet, genutzt werden (default) oder alle verordert?
            /*
            // weitere Einstellmöglichkeiten:
            removeFromQuery: ["und", "die"]; // ersetze diese Zeichenketten durch ein Leerzeichen (standardmäßig aktiv, ersetzt sehr häufig vorkommende Wörter wie z.B. "und")
            // removeFromQuery: hier ist es sinvoll, eigene Regeln nach den Standardregeln zu ergänzen:
            // dazu muss der Source-Import oben wieder eingeschlossen weden
            removeFromQuery: [...source.source.queryMakerOptions.removeFromQuery, "zusätzlich zu entfernen"]
            // replaceInQuery: auch hier macht es Sinn, die Standardregeln zu ergänzen analog zu removeFromQuery
            replaceInQuery: [pattern: "...", flags: "..",replaceWith: ".."]; // wende diesen regulären Ausdruck zur Transformation an (standardmäßig aktiv, ersetzt z.B. Sonderzeichen)
            addWildCardToSearchWords: false; // soll jedem Wort im Query eine Wildcard hinzugefügt werden? wenn der Query "Hund beißt Mann" ist, wird er zu "H*u*n*d b*e*i*ß*t M*a*n*n" -- nur sinnvoll mit längerem Query (standardmäßig deaktiviert)
            */
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
            query: [
                '.c-article-text',
                '.c-summary__intro',
                '.c-headline',
                '.o-element-text',
                'head > title',
            ],
            paywall: ['.contains_walled_content'],
            main: ['.c-content-container'],
            author: [
                (root) =>
                    Array.from(root.querySelectorAll('.c-author__link'))
                        .map((author) =>
                            (author as HTMLElement).innerText.trim().length === 0
                                ? ''
                                : '( ' +
                                  (author as HTMLElement).innerText
                                      .split(/\s+/)
                                      .join(' ')
                                      .trim() +
                                  ' )'
                        )
                        .filter((author) => author.length > 0)
                        .join(' AND '),
            ],
            date: [
                (root) =>
                    root.querySelector('.c-publish-date')?.getAttribute('datetime'),
            ],
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
        queryMakerOptions: {
            selectorStrategy: 'USE_ALL_VALID_WITH_OR',
        },
    },

    /*
        Regional
    */

    {
        match: '*://www.rhein-zeitung.de/*',
        selectors: {
            query: ['.articlebody__maintext', '.articlebody__teasertext'],
            paywall: ['.mrvpaywall__layer'],
            main: ['.articlebody__mainarticle'],
            date: [(root) => root.querySelector('time')?.getAttribute('datetime')],
            author: [
                (root) =>
                    root
                        .querySelector('.author a') // @ts-ignore
                        ?.innerText?.split(/\s+/)
                        ?.join(' '),
            ],
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

    { ...stN },

    {
        ...stN,
        match: '*://www.stuttgarter-zeitung.de/*',
    },

    {
        match: '*://www.badische-zeitung.de/*',
        selectors: {
            query: ['.artikelPreview', '.article-site__topic', 'head > title'],
            paywall: ['article:has(.freemium)'],
            main: ['#article'],
            date: [
                (root) => {
                    const articleDate = root
                        ?.querySelector('a[href^="/archiv/"')
                        // @ts-ignore
                        ?.href.split('archiv')[1];
                    if (typeof articleDate !== 'string' || articleDate.length !== 11)
                        return undefined;
                    const [_, year, month, day] = articleDate.split('/').map(Number);
                    return new Date(year, month - 1, day).toISOString();
                },
            ],
            // Autor ist hier keine gute Idee
        },
        sourceNames: [
            'Badische Zeitung',
            'Badische Zeitung / Freiburg',
            'Badische Zeitung / Offenburg',
        ],
        queryMakerOptions: {
            selectorStrategy: 'USE_ALL_VALID_WITH_OR',
        },
    },

    {
        match: '*://bnn.de/*',
        selectors: {
            query: [
                '.figure__caption-text',
                '.intro',
                '.immersive-header__intro',
                '.header',
            ],
            paywall: ['.article__paywall, .paywall'],
            main: ['.article__body, .longread-content'],
            date: [(root) => root.querySelector('time')?.getAttribute('datetime')],
            author: [
                (root) =>
                    root
                        .querySelector('.author a') // @ts-ignore
                        ?.innerText?.split(/\s+/)
                        ?.join(' '),
            ],
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
        queryMakerOptions: {
            selectorStrategy: 'USE_ALL_VALID_WITH_OR',
        },
    },

    {
        waitOnLoad: true,
        match: '*://www.mannheimer-morgen.de/*',
        selectors: {
            query: [
                '.picture__figcaption__caption',
                '.article-header-default__description',
                'header > title',
                '.article-header-default__headline__overline',
            ],
            paywall: ['#paywall-info'],
            main: ['#paywall'],
            date: [(root) => root.querySelector('time')?.getAttribute('datetime')],
            author: [
                (root) =>
                    root
                        .querySelector('.article-header-meta__data--author a') // @ts-ignore
                        ?.innerText?.split(/\s+/)
                        ?.join(' '),
            ],
        },
        sourceNames: ['Mannheimer Morgen', 'Mannheimer Morgen / Neckar-Bergstraße'],
        queryMakerOptions: {
            selectorStrategy: 'USE_ALL_VALID_WITH_OR',
        },
    },

    {
        // deaktiviert
        match: '*://www.fnweb.de/*',
        selectors: {
            query: [
                '.picture__figcaption__caption',
                '.article-header-default__description',
            ],
            paywall: ['#paywall-info-placeholder-do-not-activate-deactivated'],
            main: ['#paywall'],
        },
        sourceNames: ['Fränkische Nachrichten'],
    },

    {
        match: '*://www.volksfreund.de/*',
        waitOnLoad: true,
        selectors: {
            query: [
                '[data-cy^="article"] > p',
                '.park-article__body > p > strong',
                'head > title',
                '[data-cy="article_headline"]',
                '[data-cy="intro"]',
                '[data-cy="park-figure"] p',
            ],
            paywall: ['.park-paywall-content', '.park-widget'],
            main: ['[data-cy^="article"] > p', '.park-article'],
            date: [
                (root) =>
                    root.querySelector('[data-cy="date"]')?.getAttribute('content'),
            ],
            author: [
                (root) =>
                    Array.from(root.querySelectorAll('aside[data-cy="authorsbox"] a'))
                        // @ts-ignore
                        .map((a) => a?.innerText)
                        .filter((a) => typeof a === 'string' && a.trim().length > 0)
                        .join(' '),
            ],
        },
        sourceNames: [
            'Trierischer Volksfreund / Zeitung für Trier und das Trierer Land',
            'Trierischer Volksfreund / Bitburg-Prüm',
            'Trierischer Volksfreund / Vulkaneifel',
            'Trierischer Volksfreund / Zeitung für Trier und das Trierer Land (TV)',
            'Trierischer Volksfreund / Bitburg-Prüm (TVBP)',
            'Trierischer Volksfreund / Vulkaneifel (TVV)',
        ],
        queryMakerOptions: {
            selectorStrategy: 'USE_ALL_VALID_WITH_OR',
        },
    },

    {
        match: '*://www.swp.de/*',
        selectors: {
            query: ['.article-text', 'h1', '.lead', 'figure figcaption'],
            paywall: ['.paywall_container'],
            main: ['.article-content'],
            date: [(root) => root.querySelector('time')?.getAttribute('datetime')],
            author: [
                (root) =>
                    root
                        .querySelector('a.authorName') // @ts-ignore
                        ?.innerText?.split(/\s+/)
                        ?.join(' '),
            ],
        },

        sourceNames: [
            'Südwest Presse Ulm',
            'Südwest Presse / Neckar-Chronik',
            'Südwest Presse',
        ],
        queryMakerOptions: {
            selectorStrategy: 'USE_ALL_VALID_WITH_OR',
        },
    },
];

export default sites;
