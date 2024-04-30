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
            let summe = 0;
            for (let s of applicationState.articles) {
                const v = s[1].get();
                if (v > 0) {
                    const article = applicationConfig.articles.find(x => x.key == s[0]);
                    summe += v * ((article.price ?? 0) + (article.deposit ?? 0));
                }
                this._main.innerText = (summe / 100).toFixed(2) + ' ' + applicationConfig.config.currency;
            }
        });
    }
    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(DisplayPrice.is, DisplayPrice);
