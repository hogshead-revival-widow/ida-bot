import { PORT_NAME } from 'src/lib/globals/consts.js';
import logger from 'src/lib/utils/logger.js';
import Result from 'src/lib/utils/result.js';
import {
    assertNonNullish,
    isReachable,
    isURL,
    makeQuery,
    makeTimeInDaysRange,
    stringToDate,
} from 'src/lib/utils/utils.js';

import STRINGS from 'src/settings/strings.js';
import UI from 'src/lib/ui/ui.js';

class SiteBot {
    private _port: chrome.runtime.Port | null;
    private _source: Source;
    private readonly _fallbackSource: Source;
    readonly site: Site;
    private readonly _root: Document;
    private _UI?: UI;

    constructor(site: Site, root: Document, source: Source, fallbackSource: Source) {
        this.site = site;
        this._port = null;
        this._root = root;
        this._source = source;
        this._fallbackSource = fallbackSource;
        this.onDisconnect = this.onDisconnect.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    async start() {
        const nothingToDo = !this._hasPaywall();
        if (nothingToDo) return;

        if ('prepareSite' in this.site && this.site.prepareSite)
            this.site.prepareSite(this._root);

        this._hidePaywall();
        this._getUI().inform(STRINGS.INFO_BOX.CHECKING_CONNECTION);

        const canReachDefaultURL = await isReachable(this._source.baseURL);
        if (canReachDefaultURL) return this._getUI().offerStart();

        if (!isURL(this._fallbackSource.baseURL))
            return this._getUI().informNotReachable();
        const canReachFallbackURL = await isReachable(this._fallbackSource.baseURL);
        if (canReachFallbackURL) {
            this._source = this._fallbackSource as Source;
            return this._getUI().offerStart();
        }

        this._getUI().informNotReachable();
    }

    getDateRange() {
        const toleranceDays =
            this.site.queryMakerOptions?.toleranceDays ||
            this._source.queryMakerOptions.toleranceDays; // Tage plus/minus Artikeldatum suchen

        if (this.site.selectors.date === undefined) return undefined;
        const date = this.site.selectors.date
            .map((getDateFn) => stringToDate(getDateFn(this._root)))
            .find((maybeDate) => maybeDate !== undefined);
        return date === undefined ? date : makeTimeInDaysRange(date, toleranceDays);
    }
    getQuery() {
        // Baue Query nach diesen Parametern
        const ignoreStartWords =
            this.site.queryMakerOptions?.ignoreStartWords ||
            this._source.queryMakerOptions.ignoreStartWords;
        const ignoreEndWords =
            this.site.queryMakerOptions?.ignoreEndWords ||
            this._source.queryMakerOptions.ignoreEndWords;
        const queryTargetWords =
            this.site.queryMakerOptions?.queryTargetWords ||
            this._source.queryMakerOptions.queryTargetWords;
        const replaceInQuery =
            this.site.queryMakerOptions?.replaceInQuery ||
            this._source.queryMakerOptions.replaceInQuery;
        const removeFromQuery =
            this.site.queryMakerOptions?.removeFromQuery ||
            this._source.queryMakerOptions.removeFromQuery;
        const selectorStrategy =
            this.site.queryMakerOptions?.selectorStrategy ||
            this._source.queryMakerOptions.selectorStrategy;
        const addWildCardToSearchWords =
            this.site.queryMakerOptions?.addWildCardToSearchWords ||
            this._source.queryMakerOptions.addWildCardToSearchWords;

        const maybeQuery = [
            ...new Set(
                this.site.selectors.query
                    .map((selector) => {
                        logger(LoggerStatus.QUERYMAKER, `Selektor: ${selector}`);
                        return this._root.querySelector(selector);
                    })
                    .filter(
                        (maybeElement) =>
                            maybeElement !== null &&
                            (maybeElement as HTMLElement).innerText.length > 0
                    )
                    .map((element) =>
                        makeQuery((element as HTMLElement).innerText, {
                            ignoreStartWords,
                            ignoreEndWords,
                            queryTargetWords,
                            replaceInQuery,
                            removeFromQuery,
                            selectorStrategy,
                            addWildCardToSearchWords,
                        })
                    )
                    .filter((maybeQuery) => maybeQuery !== undefined)
            ),
        ];
        if (maybeQuery.length === 0) throw new Error('Cant extract query');

        const query =
            selectorStrategy === 'USE_FIRST_VALID'
                ? maybeQuery[0]
                : maybeQuery.map((query) => `( ${query} )`).join(' OR ');
        logger(
            LoggerStatus.QUERYMAKER,
            `Selektorstrategie: ${selectorStrategy}
            \n - Querykandidaten: ${JSON.stringify(maybeQuery)}
            \n - Ergebnis: ${query}`
        );

        // hole nun ggf. Autor:innen
        const wantsAuthor =
            this.site.selectors.author !== undefined &&
            this.site.selectors.author.length > 0;
        if (!wantsAuthor) return query;
        logger(LoggerStatus.QUERYMAKER, `Hänge Autor:innen an`);
        const authors = [
            ...new Set(
                this.site.selectors.author !== undefined &&
                this.site.selectors.author.length > 0
                    ? this.site.selectors.author
                          .map((extractor) => {
                              const maybeAuthor = extractor(this._root);
                              logger(
                                  LoggerStatus.QUERYMAKER,
                                  `Selektor (Autor): ${maybeAuthor}`
                              );
                              if (
                                  typeof maybeAuthor !== 'string' ||
                                  maybeAuthor.length === 0
                              )
                                  return undefined;
                              return maybeAuthor;
                          })
                          .filter(
                              (maybeElement) =>
                                  maybeElement !== undefined && maybeElement.length > 0
                          )
                    : []
            ),
        ];
        logger(LoggerStatus.QUERYMAKER, `Gefundene Autor:innen: ${authors}`);
        if (authors.length === 0) return query;
        const queryWithAutor = `( ${query} ) AND (${authors.join(' AND ')})`;
        logger(LoggerStatus.QUERYMAKER, ` Ergebnis: ${queryWithAutor}`);
        return queryWithAutor;
    }

    startRetrieval() {
        try {
            const query = this.getQuery();
            const dateRange = this.getDateRange();

            this._connectPort();
            this._postMessage({
                type: MessageType.START,
                site: this.site,
                source: this._source,
                query,
                dateRange,
            });
        } catch (error) {
            const reason: MessageFail = {
                message: error instanceof Error ? error.message : JSON.stringify(error),
                type: MessageType.SHOW_FAILURE_NO_QUERY,
            };
            this._fail(reason);
            return;
        }
    }

    onDisconnect() {
        this._getPort().onMessage.removeListener(this.onMessage);
        this._getPort().onDisconnect.removeListener(this.onDisconnect);
    }

    onMessage(message: Message) {
        logger(LoggerStatus.SITEBOT_IN, message.type);
        switch (message.type) {
            case MessageType.CHANGE_STATUS:
                this._getUI().inform(message.message);
                return;
            case MessageType.SHOW_FAILURE_NO_RESULT:
                this._fail(message);
                return;
            case MessageType.SHOW_RESULT:
                try {
                    const resultData = new Result(message, this._source).asData();
                    this._getUI().offerResult(resultData);
                } catch (error) {
                    this._fail({
                        message:
                            error instanceof Error
                                ? error.message
                                : JSON.stringify(error),
                        type: MessageType.SHOW_FAILURE_OTHER,
                    });
                }
                return;
            default:
                this._fail({
                    message: 'message' in message ? message.message : 'Unknown error',
                    type: MessageType.SHOW_FAILURE_OTHER,
                });
                return;
        }
    }

    private _connectUI() {
        this._UI = new UI(
            this._root,
            this._getMainContentArea(),
            this.startRetrieval.bind(this)
        );
    }

    private _getUI() {
        if (typeof this._UI === 'undefined') {
            this._connectUI();
        }
        assertNonNullish(this._UI, 'UI not found');
        return this._UI;
    }

    private _getPaywall() {
        const paywall = this.site.selectors.paywall
            .map((selector) => this._root.querySelector(selector))
            .find((maybeElement) => maybeElement !== null);
        assertNonNullish(paywall, `Paywall not found (${this.site.selectors.paywall})`);
        return paywall as HTMLElement;
    }

    private _hasPaywall() {
        return this.site.selectors.paywall.some(
            (selector) => this._root.querySelector(selector) !== null
        );
    }

    private _hidePaywall() {
        this._getPaywall().style.display = 'none';
    }

    private _showPaywall() {
        this._getPaywall().style.display = 'block';
    }

    private _getMainContentArea() {
        const content = this.site.selectors.main
            .map((selector) => this._root.querySelector(selector))
            .find((maybeElement) => maybeElement !== null);
        assertNonNullish(
            content,
            `Main content not found (${this.site.selectors.main})`
        );
        return content as HTMLElement;
    }

    private _connectPort() {
        this._port = chrome.runtime.connect({ name: PORT_NAME });
        this._port.onMessage.addListener(this.onMessage);
        this._port.onDisconnect.addListener(this.onDisconnect);
        return this._port;
    }

    private _getPort() {
        assertNonNullish(this._port, 'Port not found');
        return this._port;
    }

    private _postMessage(message: Message) {
        logger(LoggerStatus.SITEBOT_OUT, message.type);
        this._getPort().postMessage(message);
    }

    private _fail(message: MessageFail) {
        this._getUI().informFail(
            message.type === MessageType.SHOW_FAILURE_NO_QUERY
                ? STRINGS.INFO_BOX.CANT_EXTRACT
                : STRINGS.INFO_BOX.RETRIEVAL_FAILED
        );
        this._showPaywall();

        throw new Error(message.message);
    }
}

export default SiteBot;
