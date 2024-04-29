import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { Signal } from "signal-polyfill";
import { applicationState } from '../applicationState.js';
import { effect } from '../effect.js';

export class ActionButton extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        <div>
            <div>STORNO</div>
        </div>
    `;

    static readonly style = css`
        :host {
            box-sizing: border-box;
            position: relative;
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
            aspect-ratio: 1;
            font-weight: 900;
            font-size: 14px;
            width: 20px;
        }`;

    static readonly is = 'action-button';

    static readonly properties = {
        action: String
    }

    public action: 'storno' | 'clear'

    constructor() {
        super();
        super._restoreCachedInititalValues();

        this.onclick = () => {
            applicationState.storno.set(!applicationState.storno.get());
        }

        effect(() => {
            if (applicationState.storno.get())
                this.setAttribute('active', "");
            else
                this.removeAttribute('active');
        })
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
}
customElements.define(ActionButton.is, ActionButton)