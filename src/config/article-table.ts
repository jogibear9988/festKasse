import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';

export class ArticleTable extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        
    `;

    static readonly style = css`
        :host {
            box-sizing: border-box;
        }`;

    static readonly is = 'artcle-table';
    static readonly properties = {
            
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
customElements.define(ArticleTable.is, ArticleTable);