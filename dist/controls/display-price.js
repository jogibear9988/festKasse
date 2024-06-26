import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { applicationConfig } from '../applicationConfig.js';
import { applicationState } from '../applicationState.js';
import { effect } from '../effect.js';
export class DisplayPrice extends BaseCustomWebComponentConstructorAppend {
    static template = html `
        <div>
            <div id="main"></div>
        </div>`;
    static style = css `
        :host {
            box-sizing: border-box;
            position: relative;
        }
        `;
    static is = 'display-price';
    _main;
    _article;
    constructor() {
        super();
        super._restoreCachedInititalValues();
        this._main = this._getDomElement('main');
        effect(() => {
            this._main.innerText = applicationState.price.get().toFixed(2) + ' ' + applicationConfig.config.currency;
        });
    }
    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(DisplayPrice.is, DisplayPrice);
