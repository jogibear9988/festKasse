import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { Signal } from "signal-polyfill";

export class BookButton extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        <div>
            <div id="bagde"></div>
        </div>
    `;

    static readonly style = css`
        :host {
            box-sizing: border-box;
        }
        #badge {
            border-radius: 50%;
            background: lime;
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 1;
            font-weight: 900;
            font-size: 14px;
            width: 20px;
        }`;

    static readonly is = 'book-button';

    static readonly properties = {
        article: String
    }

    constructor() {
        super();
        super._restoreCachedInititalValues();
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(BookButton.is, BookButton)