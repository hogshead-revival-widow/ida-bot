import ID from '../id.js';
import STRINGS from 'src/settings/strings.js';

const INFOBOX =
    /* HTML */
    `
        <link rel="stylesheet" href="${chrome.runtime.getURL('css/bulma.min.css')}" />

        <div
            class="card has-text-left"
            id="${ID.CONTENT}"
            style="min-width: 100%; z-index:1000;"
        >
            <div class="card-content">
                <!--
                    KOPF
                -->
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img
                                src="${chrome.runtime.getURL('icons/bot48.png')}"
                                alt="Roboter"
                            />
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">${STRINGS.TEMPLATE.INFO_BOX.TITLE}</p>
                        <p class="subtitle is-6">
                            <a href="${STRINGS.TEMPLATE.INFO_BOX.MAIL_QUESTION_MAILTO}"
                                >${STRINGS.TEMPLATE.INFO_BOX.MAIL_QUESTION_LABEL}</a
                            >
                        </p>
                    </div>
                </div>

                <!--
                    INFO_BOX
                -->
                <div id="${ID.INFO_BOX}" class="content"></div>

                <!--
                    FORTSCHRITT
                -->
                <footer id="${ID.INFO_BOX_FOOTER}">
                    <progress
                        id="${ID.PROGRESS_BAR}"
                        class="progress is-primary"
                        max="100"
                        style="display: none;"
                    >
                        15%
                    </progress>

                    <!--
                    START-KNOPF
                    -->
                    <button
                        id="${ID.START_BUTTON}"
                        class="button is-primary is-large"
                        style="display: none;"
                    >
                        ${STRINGS.TEMPLATE.INFO_BOX.START_BUTTON_LABEL}
                    </button>

                    <!--
                    AKTUALISIEREN-KNOPF
                    -->
                    <button
                        id="${ID.REFRESH_BUTTON}"
                        class="button is-primary is-large"
                        onClick="window.location.reload();"
                        style="display: none;"
                    >
                        ${STRINGS.TEMPLATE.INFO_BOX.REFRESH_BUTTON_LABEL}
                    </button>
                </footer>
            </div>
        </div>
    `;

export default INFOBOX;
