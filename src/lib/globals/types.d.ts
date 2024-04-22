import type STRINGS from 'src/settings/strings.js';
import type { XOR } from 'ts-essentials';

declare global {
    type DateRange = [string, string];
    type Selector = string;
    type QueryReplaceRules = Array<{
        pattern: string;
        flags: string;
        replaceWith: string;
    }>;
    type QueryRemoveRules = Array<string>;
    interface BotMetadata {
        source: Source;
        query: string;
        site: Site;
        dateRange: DateRange | undefined;
    }

    /*
        Nachrichten
    */

    type Message =
        | MessageInit
        | MessageSuccess
        | MessageFail
        | {
              type: Exclude<
                  MessageType,
                  | MessageType.START
                  | MessageType.SHOW_RESULT
                  | MessageType.SHOW_FAILURE_NO_RESULT
                  | MessageType.SHOW_FAILURE_OTHER
              >;
              message: string;
          };

    interface MessageSuccess {
        type: MessageType.SHOW_RESULT;
        message: { rawXMLData: string; resultId: string; searchURL: string };
    }

    interface MessageFail {
        type:
            | MessageType.SHOW_FAILURE_NO_RESULT
            | MessageType.SHOW_FAILURE_NO_QUERY
            | MessageType.SHOW_FAILURE_OTHER;
        message: string;
    }

    interface MessageInit extends BotMetadata {
        type: MessageType.START;
    }

    /*
        Quelle bzw. Seite
    */

    interface SourceMetadata {
        isLoggedIn: Selector;
        baseURL: string;
        paths: {
            search: string;
            pdf: string;
            xml: string;
            item: string;
        };
        queryMakerOptions: QueryMakerOptions;
        searchParams: Record<string, string>;
    }

    type StatusXORInjectionParams = XOR<InjectionParams, Status>;
    type Source = Record<Phase, StatusXORInjectionParams[][]> & SourceMetadata;

    type Extractor = (root: Document) => undefined | null | string;
    type Site = {
        match: string;
        selectors: {
            query: Selector[];
            author?: Array<Extractor>;
            date?: Array<Extractor>;
            paywall: Selector[];
            main: Selector[];
        };

        /** Ggf. Optionen zum Bau des Querys aus dem Anrisstext angeben.
         * Werden keine quellspezifischen Regeln angegbeen, werden die Standardregeln aus settings/config.json genutzt */
        queryMakerOptions?: Partial<QueryMakerOptions>;
        sourceNames: string[];
        waitOnLoad?: boolean;
        prepareSite?: (root: Document) => void;
    };

    type QueryMakerOptions = {
        /** n erste Wörter ignorieren (oft Sondersatz) */
        ignoreStartWords: number;
        /** diese  nletzten Wörter (oft abgekürzt) ignorieren */
        ignoreEndWords: number;
        /** wie viele soll Wörter soll der Query möglichst haben? */
        queryTargetWords: number;
        /** ersetze nach diesen Regeln */
        replaceInQuery: QueryReplaceRules;
        /* ersetze diese Zeichenketten durch ein Leerzeichen */
        removeFromQuery: QueryRemoveRules;
        /** soll jedem Wort im Query eine Wildcard hinzugefügt werden? */
        addWildCardToSearchWords: boolean;
        /** Soll:
         * - nur der erste Selektor, der einen validen Query ergibt, genutzt werden ('USE_FIRST_VALID')
         * - oder sollen alle Selektoren mit validen Querys genutzt werden und verordert werden ('USE_ALL_VALID_WITH_OR')
         * ? */
        selectorStrategy: 'USE_FIRST_VALID' | 'USE_ALL_VALID_WITH_OR';
        /** wie viele Tage um das Datum soll gesucht werden? (wenn `date` in `selectors` gesetzt wurde) */
        toleranceDays: number;
    };

    /*
        Status
    */

    type Status = { status: STRINGS.STATUS };

    /*
        Injektionen
    */

    interface InjectionError {
        message: string;
    }

    type OnError = {
        onError: {
            retry: {
                max: number;
                delay: number;
                toggleTabFocus?: true;
            };
        };
    };

    interface Injection<I, IR> {
        (action: I & Partial<OnError>): IR;
    }
    interface ExtractId extends Injection<{ extractId: Selector }, MaybeResultId> {}
    interface FollowLink
        extends Injection<{ followLink: Selector }, InjectionError | undefined> {}
    interface IsPresent extends Injection<{ isPresent: Selector }, boolean> {}
    type Injections = ExtractId | FollowLink | IsPresent;
    type InjectionParams = Parameters<Injections>[0];
    type InjectionResult = ReturnType<Injections>;

    /*
        Ergebnis
    */

    type MaybeResultId = { resultId: string | null };

    interface ResultData {
        text: string;
        searchURL: string;
        itemURL: string;
        pdfURL: string;
    }

    type ResultMetadata = {
        name: string;
        category: string;
        providerId: string;
        dukey: string;
        duStation: string;
        mediumKey: string;
        mediumStation: string;
        classicStationId: string;
    };
}
