import { BaseCustomWebComponentConstructorAppend, css, html } from "@node-projects/base-custom-webcomponent";
import { CodeViewMonaco } from "@node-projects/web-component-designer-codeview-monaco";
import type * as monaco from 'monaco-editor';

export class StyleEditor extends BaseCustomWebComponentConstructorAppend {

    static readonly style = css`
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        .errorDecoration {
            background-color: red !important;
        }
    `;

    static readonly template = html`
        <div id="container" style="width: 100%; height: 100%; position: absolute;"></div>
    `;

    public async createModel(text: string) {
        const monaco = await CodeViewMonaco.getMonacoLib()
        return monaco.editor.createModel(text, 'css');
    }
    private _model: monaco.editor.ITextModel;
    public get model() {
        return this._model;
    }
    public set model(value: monaco.editor.ITextModel) {
        this._model = value;
        if (this._editor)
            this._editor.setModel(value);
    }

    public readOnly: boolean;

    static readonly properties = {
        text: String,
        readOnly: Boolean
    }

    private _container: HTMLDivElement;
    private _editor: monaco.editor.IStandaloneCodeEditor;

    constructor() {
        super();
        this._restoreCachedInititalValues();
    }

    async ready() {
        this._parseAttributesToProperties();
        //@ts-ignore
        const style = await import("monaco-editor/min/vs/editor/editor.main.css", { with: { type: 'css' } });
        //@ts-ignore
        this.shadowRoot.adoptedStyleSheets = [style.default, this.constructor.style];

        this._container = this._getDomElement<HTMLDivElement>('container')

        const monaco = await CodeViewMonaco.getMonacoLib()

        this._editor = monaco.editor.create(this._container, {
            automaticLayout: true,
            language: 'css',
            minimap: {
                size: 'fill'
            },
            readOnly: this.readOnly,
            fixedOverflowWidgets: true
        });
        if (this._model)
            this._editor.setModel(this._model);
    }

    undo() {
        this._editor.trigger('', 'undo', null)
    }

    redo() {
        this._editor.trigger('', 'redo', null)
    }

    copy() {
        this._editor.trigger('', 'editor.action.clipboardCopyAction', null)
    }

    paste() {
        this._editor.trigger('', 'editor.action.clipboardPasteAction', null)
    }

    cut() {
        this._editor.trigger('', 'editor.action.clipboardCutAction', null)
    }

    delete() {
        this._editor.trigger('', 'editor.action.clipboardDeleteAction', null)
    }
}

customElements.define('node-projects-style-editor', StyleEditor);