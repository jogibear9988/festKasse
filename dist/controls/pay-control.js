import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { applicationConfig } from '../applicationConfig.js';
import { applicationState } from '../applicationState.js';
import { effect } from '../effect.js';
export class PayControl extends BaseCustomWebComponentConstructorAppend {
    static template = html `
        <div part="main">
            <div part="sum"></div>
            <div part="number">7</div>
            <div part="number">8</div>
            <div part="number">9</div>
            <div part="number">4</div>
            <div part="number">5</div>
            <div part="number">6</div>
            <div part="number">1</div>
            <div part="number">2</div>
            <div part="number">3</div>
            <div part="number">CE</div>
            <div part="number">0</div>
            <div part="number">00</div>
        </div>`;
    static style = css `
        :host {
            box-sizing: border-box;
            position: relative;
        }

        :host::part(sum) {
            grid-column: span 3
        }

        :host::part(main) {
            display: grid;
            gap: 3px;
            grid-template-rows: repeat(5, 1fr);
            grid-template-columns: repeat(3, 1fr);
            height: 100%;
        }
        `;
    static is = 'pay-control';
    _main;
    _article;
    constructor() {
        super();
        super._restoreCachedInititalValues();
        this._main = this._getDomElement('main');
        const sum = this.shadowRoot.querySelector('[part="sum"]');
        const numbers = this.shadowRoot.querySelectorAll('[part="number"]');
        for (let c of numbers) {
            c.addEventListener('click', () => {
                let nr = applicationState.payedString.get();
                if (c.textContent === 'CE') {
                    nr = '0';
                }
                else {
                    nr += c.textContent;
                }
                applicationState.payedString.set(nr);
            });
        }
        effect(() => {
            sum.innerHTML = applicationState.payed.get().toFixed(2) + ' ' + applicationConfig.config.currency;
        });
    }
    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(PayControl.is, PayControl);
