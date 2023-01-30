import type STRINGS from 'src/settings/strings.js';
import type { XOR } from 'ts-essentials';

declare global {
    type Selector = string;

    interface BotMetadata {
        source: Source;
        query: string[];
        site: Site;
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

    type SourceMetadata = {
        isLoggedIn: Selector;
        baseURL: string;
        paths: {
            search: string;
            pdf: string;
            xml: string;
            item: string;
        };
        replaceInQuery: Array<{ pattern: string; flags: string; replaceWith: string }>;
        searchParams: Record<string, string>;
    };

    type StatusXORInjectionParams = XOR<InjectionParams, Status>;
    type Source = Record<Phase, StatusXORInjectionParams[][]> & SourceMetadata;

    type Site = {
        match: string;
        selectors: {
            query:
                | Selector[]
                | ((
                      root: Document,
                      replaceInQuery: Source['replaceInQuery']
                  ) => string[]);
            paywall: Selector[];
            main: Selector[];
        };
        sourceNames: string[];
        waitOnLoad?: boolean;
        prepareSite?: (root: Document) => void;
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
