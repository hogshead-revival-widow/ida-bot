import config from 'config.json';
import STRINGS from 'examples/strings.js';

const source: Source = {
    baseURL: config.URL.HOST,
    paths: {
        search: config.URL.PATHS.SEARCH,
        item: config.URL.PATHS.ITEM,
        pdf: config.URL.PATHS.PDF,
        xml: config.URL.PATHS.XML,
    },
    searchParams: config.SEARCH_PARAMS,
    replaceInQuery: config.REPLACE_IN_QUERY,
    removeFromQuery: config.REMOVE_FROM_QUERY,
    isLoggedIn: '.facet-header',
    LOGIN: [
        [
            {
                status: STRINGS.STATUS.WAIT_FOR_AUTO_LOGIN,
            },
            {
                followLink: `[id*='${config.RFA}']`,
                onError: {
                    retry: {
                        max: 3,
                        delay: 200,
                        toggleTabFocus: true,
                    },
                },
            },
        ],
        [
            {
                status: STRINGS.STATUS.WAIT_AFTER_LOGIN,
            },
        ],
    ],
    SEARCH: [
        [{ status: STRINGS.STATUS.SEARCH }, { extractId: '.item-list-mf > ul > li' }],
    ],
};

const fallback: Source = {
    ...source,
    baseURL: config.URL.FALLBACK_HOST,
};

export default { source, fallback };
