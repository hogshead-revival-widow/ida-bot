import STRINGS from 'src/settings/strings.js';
import { assertNonNullish } from 'src/lib/utils/utils.js';

const openFAQonRequest = () => {
    const faq = document.getElementById('faq');
    assertNonNullish(faq, `FAQ-Button nicht gefunden, erwartet unter #faq in popup`);
    faq.addEventListener('click', () => chrome.runtime.openOptionsPage());
};

const setStrings = () => {
    const faq = document.getElementById('faq');
    assertNonNullish(faq, `Not found: element with #faq`);
    faq.innerText = STRINGS.PAGES.POPUP.FAQ_BUTTON;
    const title = document.getElementById('title');
    assertNonNullish(title, `Not found: element with #title in faq`);
    title.innerHTML = STRINGS.PAGES.POPUP.TITLE;

    const contact = document.getElementById('contact');
    assertNonNullish(contact, `Not found: element with #contact in faq`);
    contact.setAttribute('href', STRINGS.PAGES.POPUP.CONTACT_MAILTO);
    contact.innerText = STRINGS.PAGES.POPUP.CONTACT_BUTTON;

    const contactHeader = document.getElementById('contact-header');
    assertNonNullish(contactHeader, `Not found: element with #contact-header in faq`);
    contactHeader.innerHTML = STRINGS.PAGES.POPUP.MAIL;
};

const run = () => {
    openFAQonRequest();
    setStrings();
};

document.addEventListener('DOMContentLoaded', run);
