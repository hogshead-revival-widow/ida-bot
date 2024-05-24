import STRINGS from 'src/settings/strings.js';

const RESULT =
    /* HTML */
    `
        <link rel="stylesheet" href="${chrome.runtime.getURL('css/bulma.min.css')}" />

        <!--
            ICONS
        -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            height="100%"
            style="display: none;"
            aria-hidden="true"
        >
            <defs>
                <symbol id="idabot-pdf">
                    <path
                        fill-rule="evenodd"
                        d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"
                    />
                </symbol>

                <symbol id="idabot-search">
                    <path
                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                </symbol>

                <symbol id="idabot-link">
                    <path
                        d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"
                    />
                    <path
                        d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"
                    />
                </symbol>
            </defs>
        </svg>

        <!--
            KOPF mit Linkleiste
        -->
        <div class="card" style="margin-bottom: 2em;">
            <header class="card-header">
                <p class="card-header-title ">
                    ${STRINGS.TEMPLATE.RESULT.ARCHIVE_NAME}
                </p>

                <!--
                    PDF-Link
                -->
                <a
                    href="{{pdfURL}}"
                    target="_blank"
                    class="card-header-icon is-size-2"
                    title="${STRINGS.TEMPLATE.RESULT.LINK_PDF}"
                >
                    <span class="icon is-medium">
                        <svg viewBox="0 0 16 16" width="100%" class="fill-primary">
                            <use href="#idabot-pdf"></use>
                        </svg>
                    </span>
                </a>

                <!--
                    Selbst-Suchen-Link
                -->
                <a
                    href="{{searchURL}}"
                    target="_blank"
                    class="card-header-icon is-size-2"
                    title="${STRINGS.TEMPLATE.RESULT.LINK_SEARCH}"
                >
                    <span class="icon is-medium">
                        <svg viewBox="0 0 16 16" width="100%" class="fill-primary">
                            <use href="#idabot-search"></use>
                        </svg>
                    </span>
                </a>

                <!--
                    Artikel-Link
                -->
                <a
                    href="{{itemURL}}"
                    target="_blank"
                    class="card-header-icon is-size-2"
                    title="${STRINGS.TEMPLATE.RESULT.LINK_ARCHIVE}"
                >
                    <span class="icon is-medium">
                        <svg viewBox="0 0 16 16" width="100%" class="fill-primary">
                            <use
                                href="#idabot-link"
                                style="width 100%; height: 100%;"
                            ></use>
                        </svg>
                    </span>
                </a>
            </header>

            <!--
                Text
            -->
            <div class="card-content">
                <div class="content" style="white-space: pre-wrap;">{{text}}</div>
            </div>

            <!--
                Footer mit Linkleiste
            -->
            <footer class="card-header" style="padding-bottom: 1em;">
                <small class="card-header-title">
                    ${STRINGS.TEMPLATE.RESULT.DISCLAIMER}
                </small>

                <!--
                    PDF-Link
                -->
                <a
                    href="{{pdfURL}}"
                    target="_blank"
                    class="card-header-icon is-size-2"
                    title="${STRINGS.TEMPLATE.RESULT.LINK_PDF}"
                >
                    <span class="icon is-medium">
                        <svg viewBox="0 0 16 16" width="100%" class="fill-primary">
                            <use href="#idabot-pdf"></use>
                        </svg>
                    </span>
                </a>

                <!--
                    Selbst-Suchen-Link
                -->
                <a
                    href="{{searchURL}}"
                    target="_blank"
                    class="card-header-icon is-size-2"
                    title="${STRINGS.TEMPLATE.RESULT.LINK_SEARCH}"
                >
                    <span class="icon is-medium">
                        <svg viewBox="0 0 16 16" width="100%" class="fill-primary">
                            <use href="#idabot-search"></use>
                        </svg>
                    </span>
                </a>

                <!--
                    Artikel-Link
                -->
                <a
                    href="{{itemURL}}"
                    target="_blank"
                    class="card-header-icon is-size-2"
                    title="${STRINGS.TEMPLATE.RESULT.LINK_ARCHIVE}"
                >
                    <span class="icon is-medium">
                        <svg viewBox="0 0 16 16" width="100%" class="fill-primary">
                            <use
                                href="#idabot-link"
                                style="width 100%; height: 100%;"
                            ></use>
                        </svg>
                    </span>
                </a>
            </footer>
        </div>
    `;

export default RESULT;
