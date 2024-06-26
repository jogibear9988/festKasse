import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { Signal } from "signal-polyfill";
import { applicationConfig } from '../applicationConfig.js';
import { IArticle } from '../StorageData.js';
import { applicationState } from '../applicationState.js';
import { effect } from '../effect.js';

export class DisplayRemaining extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        <div>
            <div id="main"></div>
        </div>`;

    static readonly style = css`
        :host {
            box-sizing: border-box;
            position: relative;
        }
        `;

    static readonly is = 'display-remaining';

    private _main: HTMLDivElement;
    private _article: IArticle;

    constructor() {
        super();
        super._restoreCachedInititalValues();

        this._main = this._getDomElement<HTMLDivElement>('main');

        effect(() => {
            this._main.innerText = applicationState.remaining.get().toFixed(2) + ' ' + applicationConfig.config.currency;
        });
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(DisplayRemaining.is, DisplayRemaining)