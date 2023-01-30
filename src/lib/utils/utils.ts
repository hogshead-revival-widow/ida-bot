import injection from 'injection';

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
    replace: Source['replaceInQuery'] // ["regexPattern":  "WertDerDafürGesetztWerdenSoll", ...}
) => {
    const cleanedText = cleanText(element.innerText, replace);
    const words = toWords(cleanedText);
    if (queryIsToShort(words, ignoreStartWords + ignoreEndWords))
        return [words.join(' ')];
    const preparedWords = words.slice(ignoreStartWords, words.length - ignoreEndWords);
    if (queryIsToShort(preparedWords, extractLength * 2))
        return [preparedWords.join(' ')];
    return [
        preparedWords.slice(0, extractLength).join(' '),
        preparedWords.slice(-extractLength - 1).join(' '),
    ];
};

const queryIsToShort = (words: string[], minLen: number) =>
    words.length <= minLen || words.join(' ').replace(/\s/g, '').length <= minLen;
const cleanText = (text: string, replace: Source['replaceInQuery']) => {
    replace.forEach(
        (rule) =>
            (text = text.replace(
                new RegExp(rule.pattern, rule.flags),
                rule.replaceWith
            ))
    );
    return text;
};
const toWords = (text: string) =>
    text.split(' ').filter((maybeWord) => maybeWord.length > 0);
