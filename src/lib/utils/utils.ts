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
    from = 2,
    to = 7,
    replace: Source['replaceInQuery'] = [], // ["regexPattern":  "WertDerDafürGesetztWerdenSoll", ...}
    minLen = 8 // Minimallänge der Query-Zeichenkette (sonst gibt's einen Fehler). Wird nach der Ersetzung gemessen.
) => {
    assertNonNullish(element);
    const maybeQuery = extractQuery(element.innerText, from, to);
    let preparedQuery = maybeQuery;
    replace.forEach(
        (rule) =>
            (preparedQuery = preparedQuery.replace(
                new RegExp(rule.pattern, rule.flags),
                rule.replaceWith
            ))
    );
    const cantUseQuery =
        preparedQuery.length <= minLen || preparedQuery.replace(/\s/g, '').length === 0;
    if (cantUseQuery) return undefined;
    return preparedQuery;
};

export const extractQuery = (text: string, from: number, to: number) => {
    const words = text.split(' ');
    if (words.length <= to) return text;
    return words.slice(from, to).join(' ');
};
