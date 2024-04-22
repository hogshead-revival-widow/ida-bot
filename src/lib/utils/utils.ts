import injection from 'injection';
import logger from 'src/lib/utils/logger.js';

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

/**
 *
 * @param query Der Query-String
 * @param addWildCardToSearchWords Soll jedem Wort eine Wildcard hinzugefügt werden? (falls abgekürzt)
 * @returns
 */
const finalizeQuery = (query: string, addWildCardToSearchWords: boolean) =>
    addWildCardToSearchWords
        ? query
              .split(/\s+/)
              .map((word) => word.split('').join('*'))
              .join(' ')
              .trim()
        : query.trim();

/** Baue aus gefundenem Text (der mindestens ein Zeichen lang ist) den Query */
export const makeQuery = (
    foundText: string,
    rules: Omit<
        Exclude<Required<Site['queryMakerOptions']>, undefined>,
        'toleranceDays'
    >
) => {
    logger(LoggerStatus.QUERYMAKER, 'Baue Query');
    logger(LoggerStatus.QUERYMAKER, `Eingangstext: ${foundText}`);
    logger(LoggerStatus.QUERYMAKER, `Nutze Regeln: ${JSON.stringify(rules)}`);

    // Wende zuerst Ersetzungsregeln an
    // da diese ggf. nicht von der CS verarbeitbare Zeichen entfernen
    let query = foundText.toLocaleLowerCase();
    rules.replaceInQuery.forEach((rule) => {
        query = query.replaceAll(
            new RegExp(rule.pattern, rule.flags),
            rule.replaceWith
        );
    });
    logger(LoggerStatus.QUERYMAKER, `Query nach Anwendung replaceInQuery: ${query}`);
    if (asWords(query).length <= rules.queryTargetWords)
        return finalizeQuery(query, rules.addWildCardToSearchWords);

    // Wende dann einfache Ersetzungen an
    // z.B. Stoppwörter entfernen
    query = asWords(query)
        .filter((word) => !rules.removeFromQuery.includes(word))
        .join(' ');
    logger(LoggerStatus.QUERYMAKER, `Query nach Anwendung removeFromQuery: ${query}`);
    if (asWords(query).length <= rules.queryTargetWords)
        return finalizeQuery(query, rules.addWildCardToSearchWords);

    // Entferne ggf. Wörter am Anfang (oft geändert)
    query =
        rules.ignoreStartWords === 0
            ? query
            : asWords(query).slice(rules.ignoreStartWords).join(' ');
    logger(LoggerStatus.QUERYMAKER, `Query nach Anwendung ignoreStartWords: ${query}`);
    if (asWords(query).length <= rules.queryTargetWords)
        return finalizeQuery(query, rules.addWildCardToSearchWords);

    // Entferne Endwörter (oft abgeschnittenes Wort)
    query =
        rules.ignoreEndWords === 0
            ? query
            : asWords(query)
                  .slice(0, asWords(query).length - rules.ignoreEndWords)
                  .join(' ');
    logger(LoggerStatus.QUERYMAKER, `Query nach Anwendung ignoreEndWords: ${query}`);
    if (asWords(query).length <= rules.queryTargetWords)
        return finalizeQuery(query, rules.addWildCardToSearchWords);

    // Schneide vom Query von vorne ab, um auf die Ziellänge zu kommen
    // da der Textanfang häufiger als das Ende verändert wird
    query = asWords(query).slice(-rules.queryTargetWords).join(' ').trim();
    logger(LoggerStatus.QUERYMAKER, `Query nach Anwendung queryTargetWords: ${query}`);
    return finalizeQuery(query, rules.addWildCardToSearchWords);
};

const asWords = (text: string) =>
    text
        .trim()
        .split(/\s+/)
        .filter((maybeWord) => maybeWord.length > 0);
