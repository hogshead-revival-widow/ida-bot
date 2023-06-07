import injection from 'injection';

export const makeTimeInDaysRange: (date: Date, toleranceDays: number) => DateRange = (
    date,
    toleranceDays
) => {
    if (toleranceDays === 0) return [asTimeInDays(date), asTimeInDays(date)];
    const fromDate = new Date(date);
    fromDate.setDate(fromDate.getDate() - toleranceDays);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + toleranceDays);
    return [asTimeInDays(fromDate), asTimeInDays(toDate)];
};

const asTimeInDays = (date: Date) => (date.getTime() / 86400000 + 719164).toFixed(0);

// Prüft ob Datum ein valides Datum ist oder "Invalid Date"
export const isValidDateObj = (maybeDate: Date) =>
    maybeDate instanceof Date && !isNaN(maybeDate?.getTime());

export const stringToDate = (maybeDateString: string | undefined | null) => {
    if (!maybeDateString) return undefined;
    const maybeDate = new Date(maybeDateString);
    return isValidDateObj(maybeDate) ? new Date(maybeDate.toDateString()) : undefined;
};
export const isURL = (maybeURL: string) => {
    try {
        new URL(maybeURL);
        return true;
    } catch (error) {
        return false;
    }
};

export function isStatus(value: StatusXORInjectionParams): value is Status {
    return typeof value === 'object' && 'status' in value;
}

export function isInjection(value: StatusXORInjectionParams): value is InjectionParams {
    return !isStatus(value);
}

export function isResultId(value: unknown): value is MaybeResultId {
    return (
        value !== null &&
        value !== undefined &&
        typeof value === 'object' &&
        'resultId' in value
    );
}

export const matchToDomain = (match: string) => {
    if (match.length < 6 || !match.endsWith('/*') || !match.startsWith('*://'))
        throw new Error(`Malformed match: ${match}`);
    return match.slice(4, match.indexOf('/*'));
};

export function assertNonNullish<T>(
    value: unknown,
    message: string = `Value is nullish`
): asserts value is NonNullable<T> {
    if (value === null || value === undefined) throw new Error(message);
}

export const isReachable = async (url: string) => {
    if (!isURL(url)) return false;
    try {
        await window.fetch(url, { mode: 'no-cors' });
        return true;
    } catch (error) {
        return false;
    }
};

export const makeQuery = (
    element: HTMLElement,
    ignoreStartWords: number,
    ignoreEndWords: number,
    extractLength: number,
    replace: Source['replaceInQuery'], // ["regexPattern":  "WertDerDafürGesetztWerdenSoll", ...}
    remove: Source['removeFromQuery']
) => {
    const cleanedText = cleanText(element.innerText, replace);
    const wordsMax = toWords(cleanedText);
    const cleanedTextWithRemovedWords = removeWords(cleanedText, remove);
    const wordsMin = toWords(cleanedTextWithRemovedWords);

    if (queryIsToShort(wordsMax, ignoreStartWords + ignoreEndWords))
        return [wordsMax.join(' ')];
    if (queryIsToShort(wordsMin, ignoreStartWords + ignoreEndWords))
        return [wordsMin.join(' ')];

    const preparedWordsMax = wordsMax.slice(
        ignoreStartWords,
        wordsMax.length - ignoreEndWords
    );
    const preparedWordsMin = wordsMin.slice(
        ignoreStartWords,
        wordsMin.length - ignoreEndWords
    );

    if (queryIsToShort(preparedWordsMax, extractLength * 2))
        return [preparedWordsMax.join(' ')];

    if (queryIsToShort(preparedWordsMin, extractLength * 2))
        return [preparedWordsMin.join(' ')];

    return [
        preparedWordsMin.slice(0, extractLength).join(' '),
        preparedWordsMin.slice(-extractLength - 1).join(' '),
    ];
};

const queryIsToShort = (words: string[], minLen: number) =>
    words.length <= minLen || words.join(' ').replace(/\s/g, '').length <= minLen;

const cleanText = (text: string, replace: Source['replaceInQuery']) => {
    replace.forEach((rule) => {
        console.log(rule);
        text = text.replace(new RegExp(rule.pattern, rule.flags), rule.replaceWith);
    });
    return text;
};

const removeWords = (text: string, remove: Source['removeFromQuery']) => {
    remove.forEach((word) => {
        text = text.replace(` ${word} `, ' ');
    });

    return text;
};
const toWords = (text: string) =>
    text.split(' ').filter((maybeWord) => maybeWord.length > 0);
