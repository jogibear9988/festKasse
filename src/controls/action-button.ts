import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { Signal } from "signal-polyfill";
import { applicationState } from '../applicationState.js';
import { effect } from '../effect.js';
import { applicationConfig } from '../applicationConfig.js';
import { printOnPrinter } from '../runtime/printer.js';

export class ActionButton extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        <div>
            <div id="main"></div>
        </div>
    `;

    static readonly style = css`
        :host {
            box-sizing: border-box;
            position: relative;
        }
        `;

    static readonly is = 'action-button';

    static readonly properties = {
        action: String
    }

    static observedAttributes = ["action"];

    get action(): 'storno' | 'clear' {
        return <any>this.getAttribute('action');
    }
    set action(value: 'storno' | 'clear') {
        this.setAttribute('action', value);
    }

    private _main: HTMLDivElement;

    constructor() {
        super();
        super._restoreCachedInititalValues();

        this._main = this._getDomElement<HTMLDivElement>('main')
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'action') {
            if (newValue === 'storno') {
                this._main.textContent = 'STORNO';
                this.onclick = () => {
                    applicationState.storno.set(!applicationState.storno.get());
                }
                effect(() => {
                    if (applicationState.storno.get())
                        this.setAttribute('active', "");
                    else
                        this.removeAttribute('active');
                });
            } else if (newValue === 'clear') {
                this._main.textContent = 'CLEAR';
                this.onclick = () => {
                    applicationState.articles.forEach(x => x.set(0));
                }
            } else if (newValue === 'print') {
                this._main.textContent = 'PRINT';
                this.onclick = async () => {
                    for (const s of applicationState.articles) {
                        const article = applicationConfig.articles.find(x => x.key == s[0]);
                        if (article) {
                            for (let n = s[1].get(); n > 0; n--) {
                                await printOnPrinter(article);
                            }
                        }
                        s[1].set(0);
                    }
                }
                applicationState.articles.forEach(x => x.set(0));
            }
        }
    }
}

customElements.define(ActionButton.is, ActionButton)