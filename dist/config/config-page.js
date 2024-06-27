import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { applicationConfig, saveConfig } from '../applicationConfig.js';
export class ConfigPage extends BaseCustomWebComponentConstructorAppend {
    static template = html `
        <div id="root">
            <input id="header">
        </div>
        <div id="buttons">
            <button id="save">save</button>
        </div>
    `;
    static style = css `
        :host {
            box-sizing: border-box;
        }
        #root {
            display: flex;
        }
        #buttons {
            display: flex;
            height: 30px;
            gap: 5px;
        }
        #grid {
            width: 100%;
            height: calc(100% - 30px);
        }`;
    static is = 'artcle-table';
    static properties = {};
    _save;
    _header;
    constructor() {
        super();
        super._restoreCachedInititalValues();
        this._header = this._getDomElement('header');
        this._header.value = applicationConfig.config.header;
        this._save = this._getDomElement('save');
        this._save.onclick = () => this.save();
    }
    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
    save() {
        applicationConfig.config.header = this._header.value;
        saveConfig();
    }
}
customElements.define(ConfigPage.is, ConfigPage);
