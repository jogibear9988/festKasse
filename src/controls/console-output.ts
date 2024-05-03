import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';

export class ConsoleOutput extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        <pre id="root">
        </pre>`;

    static readonly style = css`
        :host {
            box-sizing: border-box;
            position: relative;
            overflow: auto;
        }`;

    static readonly is = 'console-output';

    private _root: HTMLPreElement;

    constructor() {
        super();
        super._restoreCachedInititalValues();

        this._root = this._getDomElement<HTMLPreElement>('root');

        const e = console.error;
        console.error = (...args) => {
            e(...args);
            this._root.appendChild(document.createTextNode('ERROR: ' + (args?.[0] ?? '')));
        }
        const w = console.warn;
        console.warn = (...args) => {
            w(...args);
            this._root.appendChild(document.createTextNode('WARN: ' + (args?.[0] ?? '')));
        }
        const i = console.info;
        console.info = (...args) => {
            i(...args);
            this._root.appendChild(document.createTextNode('INFO: ' + (args?.[0] ?? '')));
        }
        const l = console.log;
        console.log = (...args) => {
            l(...args);
            this._root.appendChild(document.createTextNode('LOG: ' + (args?.[0] ?? '')));
        }
        const d = console.debug;
        console.debug = (...args) => {
            d(...args);
            this._root.appendChild(document.createTextNode('DEBUG: ' + (args?.[0] ?? '')));
        }
    }
}
customElements.define(ConsoleOutput.is, ConsoleOutput)