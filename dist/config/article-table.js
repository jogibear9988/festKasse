import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { createGrid } from 'ag-grid-community';
import '../../node_modules/ag-grid-community/dist/ag-grid-community.min.noStyle.js';
//@ts-ignore
import style1 from '../../node_modules/ag-grid-community/styles/ag-grid.css' with { type: 'css' };
//@ts-ignore
import style2 from '../../node_modules/ag-grid-community/styles/ag-theme-balham.css' with { type: 'css' };
import { applicationConfig, saveConfig } from '../applicationConfig.js';
export class ArticleTable extends BaseCustomWebComponentConstructorAppend {
    static template = html `
        <div id="grid" class="ag-theme-balham" ></div>
        <div id="buttons">
            <button id="save">save</button>
            <button id="add">add</button>
            <button id="remove">remove</button>
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
    static is = 'artcle-table';
    static properties = {};
    _gridDiv;
    _grid;
    _add;
    _data;
    _save;
    constructor() {
        super();
        super._restoreCachedInititalValues();
        this.shadowRoot.adoptedStyleSheets = [ArticleTable.style, style1, style2];
        this._gridDiv = this._getDomElement('grid');
        this._data = applicationConfig.articles;
        let options = {
            rowSelection: 'multiple',
            defaultColDef: {
                flex: 1,
                editable: true,
            },
            columnDefs: [
                {
                    colId: 'key',
                    field: 'key'
                }, {
                    colId: 'name',
                    field: 'name'
                }, {
                    colId: 'price',
                    field: 'price'
                }, {
                    colId: 'print',
                    field: 'print'
                }
            ],
            rowData: this._data
        };
        this._grid = createGrid(this._gridDiv, options);
        this._add = this._getDomElement('add');
        this._add.onclick = () => this.add();
        this._save = this._getDomElement('save');
        this._save.onclick = () => this.save();
    }
    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }
    remove() {
        const rows = this._grid.getSelectedRows();
        this._grid.applyTransaction({ remove: rows });
    }
    add() {
        this._grid.applyTransaction({ add: [{}] });
    }
    save() {
        const rowData = [];
        this._grid.forEachNode((node) => {
            const article = {
                key: node.data.key,
                name: node.data.name,
                print: node.data.print,
                price: parseInt(node.data.price?.toString()),
            };
            rowData.push(article);
        });
        applicationConfig.articles = rowData;
        saveConfig();
    }
}
customElements.define(ArticleTable.is, ArticleTable);
