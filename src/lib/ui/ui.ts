import STRINGS from 'src/settings/strings.js';
import TEMPLATES from './templates/index.js';
import ID from './id.js';
import { assertNonNullish } from '../utils/utils.js';

class UI {
    private readonly _root;
    private readonly _strings;
    private readonly _templates;
    private readonly _onStartRetrieval;
    private readonly _currentlyVisible: Set<ID>;

    constructor(
        siteRoot: Document,
        interfaceParent: Element,
        onStartRetrieval: VoidFunction,
        strings = STRINGS,
        templates = TEMPLATES
    ) {
        this._currentlyVisible = new Set();
        this._strings = strings;
        this._templates = templates;
        const shadowHost = siteRoot.createElement('p');
        interfaceParent.appendChild(shadowHost);
        this._root = shadowHost.attachShadow({ mode: 'closed' });
        this._onStartRetrieval = onStartRetrieval;

        this._root.innerHTML = this._templates.INFOBOX;
    }

    offerStart() {
        this.inform(this._strings.INFO_BOX.OFFER_START);
        this._display(ID.START_BUTTON);
        this._element(ID.START_BUTTON).addEventListener(
            'click',
            this._onStartRequested.bind(this)
        );
    }

    offerResult(resultData: ResultData) {
        this._hide(ID.PROGRESS_BAR);

        let template = this._templates.RESULT;
        Object.entries(resultData).forEach(([key, value]) => {
            const pattern = new RegExp('{{' + key + '}}', 'g');
            template = template.replace(pattern, value);
        });

        this._root.innerHTML = template;
    }

    inform(info: string, use: 'innerText' | 'innerHTML' = 'innerText') {
        if (!this._isVisible(ID.INFO_BOX)) {
            this._display(ID.INFO_BOX);
        }
        this._element(ID.INFO_BOX)[use] = info;
    }

    informNotReachable() {
        this._hide(ID.PROGRESS_BAR);
        this.inform(this._strings.INFO_BOX.NOT_REACHABLE, 'innerHTML');
        this._display(ID.REFRESH_BUTTON);
    }

    informFail(info: string) {
        this._hide(ID.PROGRESS_BAR);
        this.inform(info, 'innerHTML');
    }

    private _onStartRequested(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this._hide(ID.START_BUTTON);
        this._element(ID.START_BUTTON).removeEventListener(
            'click',
            this._onStartRequested.bind(this)
        );

        this.inform(this._strings.INFO_BOX.PREPARE_BOT);
        this._display(ID.PROGRESS_BAR);

        this._onStartRetrieval();
    }

    private _isVisible(id: ID) {
        return this._currentlyVisible.has(id);
    }
    private _isHidden(id: ID) {
        return !this._isVisible(id);
    }

    private _element(id: ID) {
        const element = this._root.getElementById(id);
        assertNonNullish(element, `Element not found (${id})`);
        return element;
    }
    private _display(id: ID) {
        if (this._isVisible(id)) return;

        this._currentlyVisible.add(id);
        this._element(id).style.display = 'block';
    }
    private _hide(id: ID) {
        if (this._isHidden(id)) return;

        this._currentlyVisible.delete(id);
        if (id === ID.INFO_BOX) {
            return (this._root.innerHTML = '');
        }
        this._element(id).style.display = 'none';
    }
}

export default UI;
