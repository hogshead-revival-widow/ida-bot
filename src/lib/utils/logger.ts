const MESSAGE_MAP = {
    [MessageType.START]: LoggerStatus.START,
    [MessageType.SHOW_RESULT]: LoggerStatus.FINISH,
    [MessageType.SHOW_FAILURE_NO_RESULT]: LoggerStatus.FINISH,
    [MessageType.SHOW_FAILURE_OTHER]: LoggerStatus.FINISH,
} as const;

export default function logger(status: Message): void;
export default function logger(status: LoggerStatus, msg: string): void;
export default function logger(
    status: LoggerStatus | Message,
    msg?: string,
    highlightColour = 'color: green;',
    messagesToHighlight = [LoggerStatus.START, LoggerStatus.FINISH],
    enableLogging: boolean = JSON.parse('__LOGGING__'), // cf. rollup.config.js
    logFn: (...data: any[]) => void = console.log
) {
    if (!enableLogging) return;
    if (typeof status !== 'string') return logMessage(status);

    const message = `${status} | ${msg}`;

    return messagesToHighlight.includes(status)
        ? logFn(highlight(message), highlightColour)
        : logFn(message);
}

const highlight = (logMessage: string) => `%c\n\n\n\n${logMessage}\n\n\n\n`;
const logMessage = (message: Message, messageMap = MESSAGE_MAP) => {
    const messageNeedsLogging = message.type in messageMap;
    if (!messageNeedsLogging) return;

    const loggerType = messageMap[message.type as keyof typeof messageMap];
    const msg = message.type;

    return message.type === MessageType.SHOW_FAILURE_OTHER
        ? logger(loggerType, `${msg}, reason: ${JSON.stringify(message.message)}`)
        : logger(loggerType, msg);
};
