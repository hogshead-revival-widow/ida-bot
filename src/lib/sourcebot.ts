import Injector from 'src/lib/utils/injector.js';
import logger from 'src/lib/utils/logger.js';
import {
    assertNonNullish,
    isInjection,
    isResultId,
    isStatus,
} from 'src/lib/utils/utils.js';

class SourceBot implements BotMetadata {
    private _done: boolean = false;
    private _injector?: Injector;
    private _step: number = 0;
    private _phase: Phase = Phase.LOGIN;
    readonly source: Source;
    readonly query: string;
    readonly site: Site;
    private readonly _callback: Function;
    private tabId?: number;
    private readonly _siteTabId: number;
    private _isRunning: boolean = false;

    constructor(
        source: Source,
        query: string,
        site: Site,
        siteTabId: number,
        callback: Function
    ) {
        this.source = source;
        this.query = query;
        this.site = site;
        this._siteTabId = siteTabId;
        this._callback = callback;

        this._triggerStep = this._triggerStep.bind(this);
    }

    async run() {
        const url = this._getRetrievalURL();
        const tab = await chrome.tabs.create({
            url,
            active: false,
        });
        this.tabId = tab.id;
        assertNonNullish(this.tabId, 'tabId is nullish');
        this._injector = new Injector(this.tabId, this._siteTabId);
        chrome.tabs.onUpdated.addListener(this._triggerStep);
    }

    activateTab() {
        assertNonNullish(this.tabId, 'Tab not found');
        chrome.tabs.update(this.tabId, {
            active: true,
        });
    }

    private _getRetrievalURL() {
        const baseURL = new URL(this.source.baseURL + this.source.paths.search);

        baseURL.searchParams.append('query', `${this.query}`);

        // Standardweite für die Suche setzen
        Object.entries(this.source.searchParams).forEach(([key, value]) =>
            baseURL.searchParams.append(key, value)
        );

        // Suche auf die angegebenen Publikationen beschränken
        this.site.sourceNames.forEach((sourceName) =>
            baseURL.searchParams.append(
                'facetValues[]',
                `source_name_fct=${sourceName}`
            )
        );
        return baseURL.toString();
    }

    private async _cleanUp(removeTab = false) {
        chrome.tabs.onUpdated.removeListener(this._triggerStep);
        if (!removeTab) return;

        assertNonNullish(this.tabId, "Can't remove tab -- tabId not found");
        return await chrome.tabs.remove(this.tabId);
    }

    // Callback von `chrome.tabs.onUpdated`
    private async _triggerStep(
        activatedFromTabId: number,
        tabChangeInfo: chrome.tabs.TabChangeInfo
    ) {
        const isSourceTab = activatedFromTabId === this.tabId;
        const tabIsLoaded = tabChangeInfo?.status === 'complete';
        const runStep = !this._done && isSourceTab && tabIsLoaded;

        const logMsg = `Tab has changed. Trigger runCurrentStep? ${runStep}}. IsRunning? ${this._isRunning}`;
        logger(LoggerStatus.SOURCEBOT_IN, logMsg);

        if (this._isRunning) return;
        if (this._done) await this._cleanUp();
        if (!runStep) return;

        return await this._runCurrentStep();
    }

    private _tryMovingToSearch(isLoggedIn: boolean) {
        const canMoveToSearch = this._phase === Phase.LOGIN && isLoggedIn;
        if (!canMoveToSearch) return;
        assertNonNullish(this._injector);
        this._injector.abortInjection = true;
        logger(LoggerStatus.RUN, 'Moving to search');
        this._step = 0;
        this._phase = Phase.SEARCH;
        logger(LoggerStatus.RUN, `Phase ${this._phase}, step #${this._step}`);
    }

    private _setNextStep() {
        if (this._done) return;
        const nextStep = this._step + 1;
        this._step = nextStep;
        logger(LoggerStatus.RUN, `#${nextStep}) will be the next step`);
    }

    private async _runCurrentStep() {
        logger(LoggerStatus.RUN, `Run: Phase ${this._phase}, step #${this._step}`);

        const isLoggedIn = await this._isLoggedIn();
        this._tryMovingToSearch(isLoggedIn);
        try {
            this._isRunning = true;
            const results = await this._runStepActions();
            const lastResult = results[results.length - 1];
            if (isResultId(lastResult)) await this._finalize(lastResult);
            this._isRunning = false;
            this._setNextStep();
        } catch (error) {
            this._actionHasFailed(error);
        }
    }

    private async _isLoggedIn() {
        if (this._phase === Phase.SEARCH) return true;
        assertNonNullish(this._injector, 'Injector not found');
        const response = await this._injector.inject({
            isPresent: this.source.isLoggedIn,
        });
        const isLoggedIn = typeof response !== 'boolean' ? false : response;
        logger(LoggerStatus.RUN, `is logged in? ${isLoggedIn}`);
        return isLoggedIn;
    }

    private _getCurrentActions() {
        return this.source[this._phase][this._step];
    }

    private _updateStatus(status: Status) {
        logger(LoggerStatus.SOURCEBOT_OUT, MessageType.CHANGE_STATUS);
        this._callback({
            type: MessageType.CHANGE_STATUS,
            message: status.status,
        });
    }

    private _actionHasFailed(error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const extractionHasFailed =
            this._phase === Phase.SEARCH &&
            this.source[this._phase].length - 1 === this._step;
        const hasNoResults =
            this._phase === Phase.SEARCH &&
            this.source[this._phase].length - 2 === this._step;
        const articleNotFound = extractionHasFailed || hasNoResults;

        if (articleNotFound)
            return this._fail({
                type: MessageType.SHOW_FAILURE_NO_RESULT,
                message,
            });

        return this._fail({
            type: MessageType.SHOW_FAILURE_OTHER,
            message: message,
        });
    }

    private _runAction(action: StatusXORInjectionParams) {
        const actionName = Object.keys(action)[0];
        const logMsg = `Requested: ${actionName} (Details (full action): ${JSON.stringify(
            action
        )})`;
        logger(LoggerStatus.RUN, logMsg);

        if (isStatus(action)) return this._updateStatus(action);
        assertNonNullish(this._injector, 'Injector not found');
        if (isInjection(action)) return this._injector.inject(action);
    }

    private _runStepActions() {
        const actions = this._getCurrentActions();
        const logMsg = `Actions of: Phase ${this._phase}, step #${
            this._step
        }: ${JSON.stringify(actions)}`;
        logger(LoggerStatus.RUN, logMsg);
        return Promise.all(actions.map((action) => this._runAction(action)));
    }

    private async _fetchResultData(resultId: string) {
        try {
            const url = `${this.source.baseURL}${this.source.paths.xml}/${resultId}`;
            const response = await fetch(url, { mode: 'no-cors' });
            const msg = `Fetch XML-Data erfolgreich`;
            logger(LoggerStatus.RESULT, msg);
            if (response.ok) return await response.text();
            throw new Error(
                `Fehler! Versucht zu erreichen: ${url}, Status: ${response.statusText}`
            );
        } catch (error) {
            logger(
                LoggerStatus.RESULT,
                `Fetch NICHT erfolgreich, vgl. Fehler (Details, Fehler: ${JSON.stringify(
                    error instanceof Error ? error.message : error
                )}))`
            );
            throw new Error('error');
        }
    }

    private async _finalize(result: MaybeResultId) {
        const { resultId } = result;

        if (resultId === null) {
            return this._fail({
                type: MessageType.SHOW_FAILURE_NO_RESULT,
                message: 'No matching results found',
            });
        }
        this._done = true;

        try {
            const rawXMLData = await this._fetchResultData(resultId);
            this._succeed(rawXMLData, resultId);
        } catch (error) {
            return this._fail({
                type: MessageType.SHOW_FAILURE_NO_RESULT,
                message: error instanceof Error ? error.message : JSON.stringify(error),
            });
        }
    }

    private _succeed(rawXMLData: string, resultId: string) {
        this._done = true;
        const removeTab = true;
        this._cleanUp(removeTab);
        logger(LoggerStatus.SOURCEBOT_OUT, MessageType.SHOW_RESULT);
        return this._callback({
            type: MessageType.SHOW_RESULT,
            message: {
                rawXMLData,
                resultId,
                searchURL: this._getRetrievalURL(),
            },
        });
    }

    private _fail(message: MessageFail) {
        if (this._done) return;
        this._done = true;
        this._cleanUp();
        const status =
            message.type === MessageType.SHOW_FAILURE_NO_RESULT
                ? MessageType.SHOW_FAILURE_NO_RESULT
                : 'FAILED';

        logger(LoggerStatus.SOURCEBOT_OUT, status);
        this._callback(message);
    }
}

export default SourceBot;
