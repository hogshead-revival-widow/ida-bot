import SourceBot from 'src/lib/sourcebot.js';
import { assertNonNullish } from 'src/lib/utils/utils.js';
import logger from 'src/lib/utils/logger.js';

class Reader {
    private readonly _port: chrome.runtime.Port;
    private readonly _senderTabId?: number;
    private _sourceBot?: SourceBot;

    constructor(port: chrome.runtime.Port) {
        this._port = port;
        if (port.sender && port.sender.tab) {
            this._senderTabId = port.sender.tab.id;
        }
        this.onMessage = this.onMessage.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.botCallback = this.botCallback.bind(this);
    }

    start() {
        this._port.onMessage.addListener(this.onMessage);
        this._port.onDisconnect.addListener(this.onDisconnect);
    }

    onMessage(message: Message) {
        logger(message);
        logger(LoggerStatus.READER_IN, message.type);
        switch (message.type) {
            case MessageType.START:
                this.startRetrieval(message);
                break;
            case MessageType.GO_TO_TAB:
                assertNonNullish(this._sourceBot, 'SourceBot not found');
                this._sourceBot.activateTab();
                break;
        }
    }

    onDisconnect() {
        this._cleanUp();
    }

    startRetrieval(message: MessageInit) {
        assertNonNullish(this._senderTabId, 'senderTabId is nullish');
        this._sourceBot = new SourceBot(
            message.source,
            message.query,
            message.site,
            this._senderTabId,
            this.botCallback
        );
        this._sourceBot.run();
    }

    botCallback(message: Message) {
        logger(LoggerStatus.READER_IN, message.type);
        switch (message.type) {
            case MessageType.CHANGE_STATUS:
                this._sendStatusMessage(message.message);
                break;
            case MessageType.SHOW_FAILURE_NO_RESULT:
                this._fail(message);
                break;
            case MessageType.SHOW_RESULT:
                this._success(message);
                break;
            default:
                let reason = 'Unknown error';
                if ('message' in message) reason = message.message;
                this._fail({ message: reason, type: MessageType.SHOW_FAILURE_OTHER });
                return;
        }
    }

    private _postMessage(message: Message) {
        logger(message);
        logger(LoggerStatus.READER_OUT, message.type);
        try {
            this._port.postMessage(message);
        } catch (error) {
            console.error(error);
            this._cleanUp();
        }
    }

    private _sendStatusMessage(message: string = '') {
        this._postMessage({
            type: MessageType.CHANGE_STATUS,
            message,
        });
    }

    private _success(message: MessageSuccess) {
        this._postMessage(message);
    }

    private _fail(message: MessageFail) {
        this._postMessage(message);
        this._cleanUp();
    }

    private _cleanUp() {
        this._port.onMessage.removeListener(this.onMessage);
        this._port.onDisconnect.removeListener(this.onDisconnect);
    }
}

export default Reader;
