export const PORT_NAME = 'port-from-cs';

declare global {
    const enum Phase {
        LOGIN = 'LOGIN',
        SEARCH = 'SEARCH',
    }

    const enum LoggerStatus {
        START = 'START',
        FINISH = 'FINISH',
        RUN = 'RUN',
        // Diese Komponenten interagieren mittels Nachrichten
        // und werden entsprechend geloggt.
        READER_IN = 'MSG | ---> READER',
        READER_OUT = 'MSG | <--- READER',
        SITEBOT_IN = 'MSG | ---> SITEBOT',
        SITEBOT_OUT = 'MSG | <--- SITEBOT',
        SOURCEBOT_IN = 'MSG | ---> SOURCEBOT',
        SOURCEBOT_OUT = 'MSG | <--- SOURCEBOT',
        // Diese Komponenten kommen ohne Nachrichten aus
        RESULT = 'RESULT',
        INJECTOR = 'INJECTOR',
        QUERYMAKER = 'QUERYMAKER',
    }
    const enum MessageType {
        START = 'START',
        GO_TO_TAB = 'GO_TO_TAB',
        SHOW_RESULT = 'SUCCESS (FOUND)',
        SHOW_FAILURE_NO_RESULT = 'FAILURE (NOT FOUND)',
        SHOW_FAILURE_OTHER = 'FAILURE (OTHER)',
        SHOW_FAILURE_NO_QUERY = 'FAILURE (QUERY)',
        CHANGE_STATUS = 'STATUS',
    }
}
