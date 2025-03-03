import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { Signal } from "signal-polyfill";
import { applicationConfig } from '../applicationConfig.js';
import { IArticle } from '../StorageData.js';
import { applicationState } from '../applicationState.js';
import { effect } from '../effect.js';

export class DisplayPrice extends BaseCustomWebComponentConstructorAppend {

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

    static readonly is = 'display-price';

    private _main: HTMLDivElement;
    private _article: IArticle;

    constructor() {
        super();
        super._restoreCachedInititalValues();

        this._main = this._getDomElement<HTMLDivElement>('main');

        effect(() => {
            if (applicationState.clearOnNextBook.get())
                this._main.innerText = applicationState.lastPrice.get().toFixed(2) + ' ' + applicationConfig.config.currency;
            else
                this._main.innerText = applicationState.price.get().toFixed(2) + ' ' + applicationConfig.config.currency;
        });
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(DisplayPrice.is, DisplayPrice)