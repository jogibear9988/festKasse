import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { Signal } from "signal-polyfill";
import { applicationConfig } from '../applicationConfig.js';
import { IArticle } from '../StorageData.js';
import { applicationState } from '../applicationState.js';

export class BookButton extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        <div>
            <div id="main"></div>
            <div id="price"></div>
            <div id="badge" style="display: none"></div>
        </div>`;

    static readonly style = css`
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

    static readonly is = 'book-button';

    static readonly properties = {
        article: String
    }

    static observedAttributes = ["article"];

    get article() {
        return this.getAttribute('article');
    }
    set article(value: string) {
        this.setAttribute('article', value);
    }

    private _main: HTMLDivElement;
    private _price: HTMLDivElement;
    private _article: IArticle;
    private _badge: HTMLDivElement;

    private count = 0;

    constructor() {
        super();
        super._restoreCachedInititalValues();

        this._main = this._getDomElement<HTMLDivElement>('main');
        this._price = this._getDomElement<HTMLDivElement>('price');
        this._badge = this._getDomElement<HTMLDivElement>('badge');

        this.onclick = () => {
            if (applicationState.storno.get()) {
                this.count -= 1;
                applicationState.storno.set(false);
            } else {
                this.count += 1;
            }
            if (this.count < 0)
                this.count = 0;
            
            if (this.count > 0) {
                this._badge.textContent = '' + this.count;
                this._badge.style.display = '';
            } else {
                this._badge.textContent = '';
                this._badge.style.display = 'none';
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'article') {
            this._article = applicationConfig.articles.find(x => x.key === newValue);
            this._main.innerHTML = this._article.name;
            this._price.innerHTML = (this._article.price / 100).toFixed(2) + ' ' + applicationConfig.config.currency;
        }
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(BookButton.is, BookButton)