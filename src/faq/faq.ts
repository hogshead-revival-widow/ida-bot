import { assertNonNullish } from 'src/lib/utils/utils.js';
import sites from 'src/settings/sites.js';
import STRINGS from 'src/settings/strings.js';

const defaults = {
    installDate: null,
};

const setStrings = (
    idFaqQuestions = 'faq-questions',
    idFaqAnswers = 'faq-answers',
    idOfEleStringMap = {
        pageTitle: STRINGS.PAGES.OPTIONS.PAGE_TITLE,
        title: STRINGS.PAGES.OPTIONS.TITLE,
        subtitle: STRINGS.PAGES.OPTIONS.SUBTITLE,
        footer: STRINGS.PAGES.OPTIONS.FOOTER,
    }
) => {
    Object.entries(idOfEleStringMap).forEach(([idOfEle, value]) => {
        const ele = document.getElementById(idOfEle);
        assertNonNullish(ele, `Not found: element with #${idOfEle} in faq`);
        ele.innerHTML = value;
    });

    const faqQuestions = document.getElementById(idFaqQuestions);
    assertNonNullish(faqQuestions, `Not found: element with #${idFaqQuestions} in faq`);
    const faqAnswers = document.getElementById(idFaqAnswers);
    assertNonNullish(faqAnswers, `Not found: element with #${idFaqAnswers} in faq`);

    const faqEntries = STRINGS.PAGES.OPTIONS.FAQ;
    const availableSites = sites
        .map((site) => {
            const href = site.match.replace('*://', '').replace('*', '');
            return `<li> <a href="https://${href}" target="_blank">${href}</a> </li>`;
        })
        .join('');

    const supportedSites = {
        label: 'Unterstützte Websites',
        question: 'Welche Seiten werden aktuell unterstützt?',
        /* HTML */
        answer: `${STRINGS.PAGES.OPTIONS.SUPPORTED_SITES} <ul>${availableSites}</ul>
        `,
    };
    [...faqEntries, supportedSites].forEach((faq) => {
        const faqID = faq.label;

        // frage hinzufügen
        const question = document.createElement('li');
        const link = document.createElement('a');
        question.appendChild(link);
        link.setAttribute('href', `#${faqID}`);
        link.innerText = faq.question;
        faqQuestions.appendChild(question);

        // antwort hinzufügen
        const answer = document.createElement('div');
        answer.setAttribute('id', faqID);
        answer.classList.add('box');
        const answerTitle = document.createElement('h4');
        answerTitle.classList.add('title', 'is-3');
        answerTitle.innerText = faq.label;
        answer.appendChild(answerTitle);
        const answerText = document.createElement('div');
        answerText.innerHTML = faq.answer;
        answer.appendChild(answerText);
        const goToTab = document.createElement('p');
        goToTab.setAttribute('style', 'text-align: right;');
        const goToTabLink = document.createElement('a');
        goToTabLink.setAttribute('href', `#${idFaqQuestions}`);
        goToTabLink.innerText = '[^]';
        goToTab.appendChild(goToTabLink);
        answer.appendChild(goToTab);
        faqAnswers.appendChild(answer);
    });
};

function run() {
    chrome.storage.sync.get(defaults).then(function (items) {
        if (items.installDate === null) {
            // first run
            chrome.storage.sync.set({
                installDate: new Date().getTime(),
            });
        }
    });

    setStrings();
}

document.addEventListener('DOMContentLoaded', run);
