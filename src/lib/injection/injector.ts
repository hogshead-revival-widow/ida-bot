/*
    ACHTUNG: Diese Klasse wurde nicht vollständig getypt.
    Insbesondere der Rückgabewert von `Injector.inject`
    ist ungenau, insofern er alle möglichen Rückgabewerte
    aller Injektionen angibt, statt der jeweils übergebenen.
*/

import injection from 'src/lib/injection/index.js';
import logger from 'src/lib/utils/logger.js';

class Injector {
    sourceTabId: number;
    siteTabId: number;
    abortInjection = false;

    constructor(sourceTabId: number, siteTabId: number) {
        this.sourceTabId = sourceTabId;
        this.siteTabId = siteTabId;
    }

    getName(args: InjectionParams) {
        return Object.keys(args)[0] as keyof typeof injection;
    }

    getInjectionFn(key: keyof typeof injection) {
        return injection[key];
    }

    async runInjection(
        args: InjectionParams,
        injectionFn: ReturnType<typeof this.getInjectionFn>
    ) {
        // @ts-expect-error
        let [{ result }] = await chrome.scripting.executeScript({
            args: [args],
            target: { tabId: this.sourceTabId },
            func: injectionFn,
        });
        // Hier läuft etwas beim Typing schief
        // Einstweilen wird der Rückgabetyp daher erzwungen
        return result as InjectionResult;
    }

    async inject(args: InjectionParams) {
        const injectionName = this.getName(args);
        const injectionFn = this.getInjectionFn(injectionName);

        const msg = `${injectionName}: Injecting (Details: ${JSON.stringify(args)})`;
        logger(LoggerStatus.INJECTOR, msg);

        let result = await this.runInjection(args, injectionFn);

        const tryAgain = this.retryRequested(args);
        if (this.isError(result) && tryAgain) {
            let retryCount = 0;
            const maxRetries = args.onError.retry.max;
            const retryDelay = args.onError.retry.delay / 1000; // seconds
            while (this.isError(result) && retryCount <= maxRetries) {
                retryCount += 1;
                const announcerMsg = `${injectionName}: Retry #${retryCount}/${maxRetries}`;
                logger(LoggerStatus.INJECTOR, announcerMsg);
                const delayMsg = `-> Has been delayed for ${retryDelay} seconds`;
                logger(LoggerStatus.INJECTOR, delayMsg);
                await new Promise((r) => setTimeout(r, args.onError.retry.delay));
                if (this.abortInjection) {
                    const abortMsg = `${announcerMsg} -> Aborting retry! Step was changed`;
                    logger(LoggerStatus.INJECTOR, abortMsg);
                    this.abortInjection = false;
                    return;
                }
                const hasBeenDelayedMsg = `${msg} \n -> Delay over`;
                logger(LoggerStatus.INJECTOR, hasBeenDelayedMsg);
                await this.runBeforeRetry(injectionName, args);
                result = await this.runInjection(args, injectionFn);
            }
        }

        if (!this.isError(result)) {
            logger(
                LoggerStatus.INJECTOR,
                `${injectionName}: result: ${JSON.stringify(result)}`
            );

            return result;
        }

        if (this.isError(result) && !tryAgain) {
            // Da auch Fehler dem serialisiert werden,
            // werden sie so eingefangen.
            const msg = `${injectionName}: Has error & retry wasn't requested; aborting`;
            logger(LoggerStatus.INJECTOR, msg);
            const errorMsg = `${injectionName}: Tried: ${JSON.stringify(injection)},
                 got error: ${result.message}`;
            throw new Error(errorMsg);
        }
    }

    async runBeforeRetry(name: string, injection: InjectionParams & OnError) {
        const { toggleTabFocus } = injection.onError.retry;
        if (toggleTabFocus !== true) return;
        try {
            await this.toggleTabFocus();
        } catch (error) {
            const msg = `${name}: Running 'toggleTabFocus' before retry has failed. Details: ${JSON.stringify(
                error
            )}`;
            logger(LoggerStatus.INJECTOR, msg);
            console.error(LoggerStatus.INJECTOR, error);
        }
    }

    async toggleTabFocus(keepFocusFor = 1) {
        logger(LoggerStatus.INJECTOR, 'Requested: Toggle tab focus');
        const tabUpdate = { highlighted: true, active: true };
        const { highlighted: isFocused } = await chrome.tabs.get(this.sourceTabId);
        if (isFocused) return; // nothing to do
        await chrome.tabs.update(this.sourceTabId, tabUpdate);
        logger(LoggerStatus.INJECTOR, 'Activated sourceTab');
        await new Promise((r) => setTimeout(r, keepFocusFor));
        const r = await chrome.tabs.update(this.siteTabId, tabUpdate);
        console.log('Switched back to siteTab', JSON.stringify(r), this.siteTabId);
        logger(LoggerStatus.INJECTOR, 'Switched back to siteTab');
    }

    retryRequested(value: InjectionParams): value is InjectionParams & OnError {
        return 'onError' in value;
    }
    isError(value: InjectionResult): value is InjectionError {
        return (
            value !== undefined &&
            value !== null &&
            typeof value !== 'string' &&
            typeof value !== 'boolean' &&
            'message' in value
        );
    }
}

export default Injector;
