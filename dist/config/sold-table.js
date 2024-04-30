import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { createGrid } from 'ag-grid-community';
import '../../node_modules/ag-grid-community/dist/ag-grid-community.min.noStyle.js';
//@ts-ignore
import style1 from '../../node_modules/ag-grid-community/styles/ag-grid.css' with { type: 'css' };
//@ts-ignore
import style2 from '../../node_modules/ag-grid-community/styles/ag-theme-balham.css' with { type: 'css' };
import { applicationConfig } from '../applicationConfig.js';
import { getSoldConfig, clearSoldConfig } from '../applicationStateStorage.js';
export class SoldTable extends BaseCustomWebComponentConstructorAppend {
    static template = html `
        <div id="grid" class="ag-theme-balham" ></div>
        <div id="buttons">
            <button id="clear">clear</button>
            <div style="margin-left: 20px; display: flex; align-items: center;">Summe: <div id="sum"></div>€</div>
        </div>
    `;
    static style = css `
        :host {
            box-sizing: border-box;
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
    static is = 'sold-table';
    static properties = {};
    _gridDiv;
    _grid;
    _clear;
    _data;
    constructor() {
        super();
        super._restoreCachedInititalValues();
        this.shadowRoot.adoptedStyleSheets = [SoldTable.style, style1, style2];
        this._gridDiv = this._getDomElement('grid');
        const solds = getSoldConfig();
        const app = applicationConfig.articles;
        this._data = app.map(x => ({ name: x.name, price: (x.price / 100).toFixed(2), count: solds.find(y => y.key == x.key)?.count ?? 0, sum: (x.price * (solds.find(y => y.key == x.key)?.count ?? 0) / 100).toFixed(2) }));
        let sum = 0;
        for (const a of app) {
            const soldCnt = solds.find(y => y.key == a.key)?.count ?? 0;
            sum += soldCnt * a.price;
        }
        this._getDomElement('sum').innerText = (sum / 100).toFixed(2);
        let options = {
            rowSelection: 'multiple',
            defaultColDef: {
                flex: 1,
                editable: false,
            },
            columnDefs: [
                {
                    colId: 'name',
                    field: 'name'
                }, {
                    colId: 'price',
                    field: 'price'
                }, {
                    colId: 'count',
                    field: 'count'
                }, {
                    colId: 'sum',
                    field: 'sum'
                }
            ],
            rowData: this._data
        };
        this._grid = createGrid(this._gridDiv, options);
        this._clear = this._getDomElement('clear');
        this._clear.onclick = () => this.clear();
    }
    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
    clear() {
        clearSoldConfig();
    }
}
customElements.define(SoldTable.is, SoldTable);
