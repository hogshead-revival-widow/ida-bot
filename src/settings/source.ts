import config from 'config.json';
import STRINGS from 'src/settings/strings.js';

const source: Source = {
    baseURL: config.URL.HOST,
    paths: {
        search: config.URL.PATHS.SEARCH,
        item: config.URL.PATHS.ITEM,
        pdf: config.URL.PATHS.PDF,
        xml: config.URL.PATHS.XML,
    },
    searchParams: config.SEARCH_PARAMS,
    queryMakerOptions: {
        ignoreStartWords: config.QUERY_MAKER_OPTIONS.ignoreStartWords,
        ignoreEndWords: config.QUERY_MAKER_OPTIONS.ignoreEndWords,
        queryTargetWords: config.QUERY_MAKER_OPTIONS.queryTargetWords,
        replaceInQuery: config.QUERY_MAKER_OPTIONS.replaceInQuery,
        removeFromQuery: config.QUERY_MAKER_OPTIONS.removeFromQuery,
        selectorStrategy: 'USE_FIRST_VALID',
        addWildCardToSearchWords: config.QUERY_MAKER_OPTIONS.addWildCardToSearchWords,
        toleranceDays: config.QUERY_MAKER_OPTIONS.toleranceDays,
    },
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
