import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { applicationConfig } from '../applicationConfig.js';
import { applicationState } from '../applicationState.js';
import { effect } from '../effect.js';
export class BookButton extends BaseCustomWebComponentConstructorAppend {
    static template = html `
        <div>
            <div id="main"></div>
            <div id="price"></div>
            <div id="badge" style="display: none"></div>
        </div>`;
    static style = css `
        :host {
            box-sizing: border-box;
            position: relative;
        }
        #price {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 14px;
        }
        #badge {
            color: black;
            position: absolute;
            right: -5px;
            bottom: -5px;
            border-radius: 50%;
            background: lime;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 900;
            font-size: 16px;
            width: 22px;
            height: 22px;
        }`;
    static is = 'book-button';
    static properties = {
        article: String
    };
    static observedAttributes = ["article"];
    get article() {
        return this.getAttribute('article');
    }
    set article(value) {
        this.setAttribute('article', value);
    }
    _main;
    _price;
    _article;
    _badge;
    constructor() {
        super();
        super._restoreCachedInititalValues();
        this._main = this._getDomElement('main');
        this._price = this._getDomElement('price');
        this._badge = this._getDomElement('badge');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'article') {
            this._article = applicationConfig.articles.find(x => x.key === newValue);
            this._main.innerHTML = this._article.name;
            this._price.innerHTML = (this._article.price / 100).toFixed(2) + ' ' + applicationConfig.config.currency;
            const state = applicationState.articles.get(this._article?.key);
            this.onclick = () => {
                if (state) {
                    let value = state.get();
                    if (applicationState.storno.get()) {
                        value -= 1;
                        applicationState.storno.set(false);
                    }
                    else {
                        value += 1;
                    }
                    if (value < 0)
                        value = 0;
                    state.set(value);
                }
            };
            if (state) {
                effect(() => {
                    const value = state.get();
                    if (value > 0) {
                        this._badge.textContent = '' + value;
                        this._badge.style.display = '';
                    }
                    else {
                        this._badge.textContent = '';
                        this._badge.style.display = 'none';
                    }
                });
            }
        }
    }
    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(BookButton.is, BookButton);
