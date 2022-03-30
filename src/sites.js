/* Auf der "Badischen Zeitung" ist im ersten
Absatz (nur durch <br> getrennt) ein mehrfach wiederverwendeter Text
*/
function badischeZeitungignoreFirst(node) {
  const textElement = node.innerText;
  const splittedTextElement = textElement.split("\n");
  console.log(splittedTextElement);
  const minimumWords = 8;
  if (splittedTextElement.length > 1) {
    const longestString = splittedTextElement.reduce((a, b) =>
      a.length > b.length ? a : b
    );
    // Ausschließen, dass das nur eine Zwischenüberschrift ist
    if (longestString.split(" ").length > minimumWords) {
      if (
        longestString === splittedTextElement[0] &&
        splittedTextElement[1].split(" ").length > minimumWords
      ) {
        return splittedTextElement[1];
      } else {
        return longestString;
      }
    }
  }
  return textElement;
}

const extractQuery = (node) =>
  `"${node.innerText.split(" ").slice(3, 11).join(" ")}"`;
const extractQueryBadische = (node) =>
  `"${badischeZeitungignoreFirst(node).split(" ").slice(3, 11).join(" ")}"`;
// Im ersten Paragraphen von Magazin-Artikeln versteckt sich oft ein online-spezifischer Teaser
function zeitConditionalElement() {
  const paragraphs = document.querySelectorAll(".article__item .paragraph");
  if (paragraphs.length > 1) {
    return paragraphs[1];
  }
  return paragraphs[0];
}

export default {
  'bnn.de': {
    // Bei Longreads werden andere Klassen genutzt
    selectors: {
      query: () => {
        
        return extractQuery(document.querySelector('.article__body p, .longread-content'))
      },
      paywall: '.article__paywall, .paywall',
      main: '.article__body, .longread-content'
    },
    start: (root) => {
      const el = root.querySelector('.article__paywall.paywall')
      el?el.classList.remove('paywall'):true
    },
    sourceParams: {
      dbShortcut: 'Badische Neues*'
    }
  },
  "www.mannheimer-morgen.de": {
    selectors: {
      query: () =>
        extractQuery(document.querySelector(".article-body-default__content")),
      paywall: ".paywall.paywall--delimiter",
      main: ".article-body-default__content",
    },
    sourceParams: {
      dbShortcut: "Mannheimer*",
    },
  },
  "www.fnweb.de": {
    selectors: {
      query: () =>
        extractQuery(document.querySelector(".article-body-default__content")),
      paywall: ".paywall.paywall--delimiter",
      main: ".article-body-default__content",
    },
    sourceParams: {
      dbShortcut: "Fränkische Nachrichten",
    },
  },
  "www.swp.de": {
    selectors: {
      query: () => extractQuery(document.querySelector(".article-text")),
      paywall: ".paywall_container",
      main: ".article-content",
    },
    sourceParams: {
      dbShortcut: "Südwest Presse Ulm*",
    },
  },
  "www.volksfreund.de": {
    waitOnLoad: true,
    selectors: {
      query: () =>
        extractQuery(
          document.querySelector(".park-article__body > p > strong")
        ),
      paywall: ".park-widget",
      main: ".park-article",
    },
    start: (root) => {
      root
        .querySelector(".park-article--reduced")
        ?.classList.remove("park-article--reduced");
    },
    sourceParams: {
      dbShortcut: "Trierischer Volksfreund*",
    },
  },
  "www.nzz.ch": {
    waitOnLoad: true,
    selectors: {
      query: () =>
        extractQuery(document.querySelector(".articlecomponent.text")),
      paywall: ".regwall__wrapper",
      main: ".messagebox-pleaseregister__inner",
    },
    sourceParams: {
      dbShortcut: "Neue Zürcher Zeitung*",
    },
  },
  "www.bild.de": {
    waitOnLoad: true,
    selectors: {
      query: () => {
        return extractQuery(
          document.querySelector(".headline")
            ? document.querySelector(".headline")
            : document.querySelector(".article-header__headline")
        );
      },
      paywall: `${
        document.querySelector(".conversion")
          ? ".conversion"
          : ".offer-module__red"
      }`,
      main: `${
        document.querySelector(".conversion-page")
          ? ".conversion-page"
          : ".offer-module"
      }`,
    },
    sourceParams: {
      // Parameter aus PAN: Quelle, bekannte Operatoren sind erlaubt (&, /,...)
      dbShortcut: "Bild*",
    },
  },
  "www.zeit.de": {
    selectors: {
      // Aus welchem Element des Textes soll extrahiert werden, um in PAN danach zu suchen?
      query: () => {
        return extractQuery(zeitConditionalElement());
      },
      // Wo ist die Paywall?
      paywall: ".gate.article__item",
      // Worunter ist der Artikeltext versammelt?
      main: ".article-page .article__item",
    },
    // Sind vor weiteren Schritten vorbereitende Schritte nötig, z. B. ein Blurring zu entfernen?
    start: (root) => {
      root
        .querySelector(".paragraph--faded")
        .classList.remove("paragraph--faded");
    },
    sourceParams: {
      // Parameter aus PAN: Quelle, bekannte Operatoren sind erlaubt (&, /,...)
      dbShortcut: "ZEIT / Zeit Hamburg / Zeit-Magazin",
    },
  },
  "www.badische-zeitung.de": {
    selectors: {
      query: () => {
        return extractQueryBadische(
          document.querySelector(".freemium__preview")
        );
      },
      paywall: ".freemium__content.freemium__content--v2",
      main: ".freemium__preview",
    },
    sourceParams: {
      dbShortcut: "Badische Zeitung*",
    },
  },
  "www.sueddeutsche.de": {
    selectors: {
      query: () => {
        return extractQuery(
          document.querySelector(".sz-article-body__paragraph")
        );
      },
      paywall: "offer-page",
      main: "div[itemprop='articleBody']",
    },
    start: (root) => {
      const p = root.querySelector(".sz-article-body__paragraph--reduced");
      if (p) {
        p.className = "sz-article-body__paragraph";
      }
    },
    sourceParams: {
      dbShortcut: "Süddeu*",
    },
  },
  "www.stuttgarter-zeitung.de": {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector(".article-body > p"));
      },
      paywall: ".c1-offers-target",
      main: ".brickgroup .mod-article p:not(.box-lead)",
    },
    start: (root) => {
      const bricks = [
        root.querySelector(".mod-header-article-overlay-wrap"),
        root.querySelector(".statichtmlbrick"),
      ];
      bricks.forEach((ele, i) => (ele ? ele.remove() : true));
    },
    sourceParams: {
      dbShortcut: "Stuttgarter Zeitung",
    },
  },
  "www.welt.de": {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector(".c-article-text p"));
      },
      paywall: ".contains_walled_content",
      main: ".c-article-text",
    },
    sourceParams: {
      dbShortcut: "Welt / Welt am *",
    },
  },
  "www.faz.net": {
    selectors: {
      query: () => {
        return extractQuery(document.querySelector(".atc-Text p"));
      },
      paywall: ".js-atc-ContainerPaywall",
      main: ".atc-Text",
    },
    start: (root) => {
      root
        .querySelector("section.js-atc-ContainerPaywall ")
        .classList.remove("atc-ContainerPaywall");
    },
    sourceParams: {
      dbShortcut: "Frankfurter Allgemeine*",
    },
  },
  "zeitung.faz.net": {
    selectors: {
      query: () => {
        return extractQuery(
          document.querySelector(
            ".article__container.article__container--medium p"
          )
        );
      },
      paywall: ".red-carpet",
      main: ".article__container.article__container--medium",
    },
    start: (root) => {
      root
        .querySelector(".fade-out-to-bottom")
        .classList.remove("fade-out-to-bottom");
    },
    sourceParams: {
      dbShortcut: "Frankfurter Allgemeine*",
    },
  },
};
