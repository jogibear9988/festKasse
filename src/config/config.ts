import { DocumentContainer, ExtensionType, PaletteView, PointerToolButtonProvider, PreDefinedElementsService, PropertyGrid, SelectorToolButtonProvider, SeperatorToolProvider, TransformToolButtonProvider, ZoomToolButtonProvider } from "@node-projects/web-component-designer";
import createDefaultServiceContainer from "./setupDesigner.js";
import { DockSpawnTsWebcomponent } from 'dock-spawn-ts/lib/js/webcomponent/DockSpawnTsWebcomponent.js';
import { StyleEditor } from "./styleEditor.js";

import '../controls/controls.js';
import 'dock-spawn-ts/lib/js/webcomponent/DockSpawnTsWebcomponent.js';
import '@node-projects/web-component-designer';
import './styleEditor.js';
import './article-table.js';
import './config-page.js';
import { ArticleTable } from "./article-table.js";
import { applicationConfig, getConfig, saveConfig, setConfig } from "../applicationConfig.js";
import { SoldTable } from "./sold-table.js";
import { ConfigPage } from "./config-page.js";

const serviceContainer = createDefaultServiceContainer();
serviceContainer.designerExtensions.set(ExtensionType.Doubleclick, []);
serviceContainer.register('elementsService', new PreDefinedElementsService('demo', {
    elements: [
        "book-button",
        "action-button",
        "display-price",
        "console-output",
        "pay-control",
        "display-remaining"
    ]
}));

serviceContainer.designViewToolbarButtons.length = 0;
serviceContainer.designViewToolbarButtons.push(
    new PointerToolButtonProvider(),
    new SeperatorToolProvider(22),
    new SelectorToolButtonProvider(),
    new SeperatorToolProvider(22),
    new ZoomToolButtonProvider(),
    new SeperatorToolProvider(22),
    new TransformToolButtonProvider()
);
serviceContainer.instanceServiceContainerCreatedCallbacks.push(instanceServiceContainer => {
    instanceServiceContainer.designContext.extensionOptions.gridExtensionShowOverlay = true;
})

const style = `
:host {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px;
    background: black;
    user-select: none;
}

* {
    font-family: 'Courier New', Courier, monospace;
    user-select: none;
}

book-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #222222;
    color: white;
    border: 1px solid white;
    cursor: pointer;
}

action-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: lightgray;
    color: black;
    font-weight: 900;
    border: 1px solid white;
    cursor: pointer;
}

action-button[active] {
    background: red;
}

display-price {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 900;
    font-size: 40px;
    border: 1px solid white;
    border-style: double;
    border-width: thick;
}

pay-control::part(sum) {
    border: 1px solid white;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
}

pay-control::part(number) {
    border: 1px solid white;
    color: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
}

pay-control::part(number):hover {
    background-color: lightgray;
}

pay-control::part(number):active {
    padding-left: 5px;
    padding-top: 5px;
}

display-remaining {
    display: flex;
    justify-content: center;
    align-items: center;
    color: yellow;
    font-weight: 900;
    font-size: 40px;
    border: 1px solid white;
    border-style: double;
    border-width: thick;
}`;
//clear cache??
//const cache = await caches.open(cacheName);

const dock = document.getElementById('dock') as DockSpawnTsWebcomponent;
const paletteView = document.getElementById('palette') as PaletteView;
const propertyGrid = document.getElementById('propertyGrid') as PropertyGrid;
const styleEditor = document.getElementById('styleEditor') as StyleEditor;

paletteView.loadControls(serviceContainer, serviceContainer.elementsServices);
propertyGrid.serviceContainer = serviceContainer;

dock.dockManager.addLayoutListener({
    onActiveDocumentChange: (manager, panel) => {
        if (panel) {
            let element = dock.getElementInSlot((<HTMLSlotElement><any>panel.elementContent));
            if (element && element instanceof DocumentContainer) {
                let sampleDocument = element as DocumentContainer;
                styleEditor.model = sampleDocument.additionalData?.model;
                propertyGrid.instanceServiceContainer = sampleDocument.instanceServiceContainer;
            }
        }
    },
    onClosePanel: (manager, panel) => {
        if (panel) {
            let element = dock.getElementInSlot((<HTMLSlotElement><any>panel.elementContent));
            if (element && element instanceof DocumentContainer) {
                (<DocumentContainer>element).dispose();
            }
        }
    }
});

function newDocument(code: string, style: string) {
    let screen = new DocumentContainer(serviceContainer);
    screen.title = "layout";
    screen.setAttribute('dock-spawn-panel-type', 'document');
    screen.setAttribute('dock-spawn-hide-close-button', '');
    screen.additionalStylesheets = [
        {
            name: "stylesheet.css",
            content: style
        }
    ];
    const model = styleEditor.createModel(screen.additionalStylesheets[0].content);
    screen.additionalData = { model: model };

    let timer;
    let disableTextChangedEvent = false;
    model.onDidChangeContent((e) => {
        if (!disableTextChangedEvent) {
            if (timer)
                clearTimeout(timer)
            timer = setTimeout(() => {
                screen.additionalStylesheets = [
                    {
                        name: "stylesheet.css",
                        content: model.getValue()
                    }
                ];
                timer = null;
            }, 250);
        }
    });
    screen.additionalStylesheetChanged.on(() => {
        disableTextChangedEvent = true;
        if (model.getValue() !== screen.additionalStylesheets[0].content)
            model.applyEdits([{ range: model.getFullModelRange(), text: screen.additionalStylesheets[0].content, forceMoveMarkers: true }]);
        disableTextChangedEvent = false;
    });

    screen.tabIndex = 0;
    screen.addEventListener('keydown', (e) => {
        if (e.key == "Escape") {
            e.stopPropagation();
        }
    }, true);
    dock.appendChild(screen);

    if (code) {
        screen.content = code;
    }

    //todo - remove and create a screens editor control
    const save = document.getElementById('save') as HTMLButtonElement;
    save.onclick = () => {
        applicationConfig.screens = [{
            html: screen.content,
            style: model.getValue()
        }];
        saveConfig();
    }
    const cmdExport = document.getElementById('export') as HTMLButtonElement;
    cmdExport.onclick = () => {
        let data = getConfig();
        exportData(data, 'kasse-config', 'json');
    }
    const cmdImport = document.getElementById('import') as HTMLButtonElement;
    cmdImport.onclick = async () => {
        let files = await openFileDialog('json', false, 'text')
        if (files) {
            let data = files[0].data;
            setConfig(data);
        }
    }
}

export async function openFileDialog(extension: string, multiple = false, readMode: 'binary' | 'text' = 'binary') {
    return new Promise<{ name: string; data: string }[]>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.multiple = multiple;
        if (extension) {
            input.accept = extension;
        }
        document.body.appendChild(input);
        input.click();
        input.onchange = async (e) => {
            const files = await readFiles(input.files, readMode);
            document.body.removeChild(input);
            resolve(files);
        };
    });
}

export async function readFiles(files: FileList | File[], readMode: 'binary' | 'text' | 'url' = 'binary') {
    return new Promise<{ name: string; data: string, size: number }[]>(async (resolve, reject) => {
        const results: { name: string; data: string, size: number }[] = [];
        const ps: Promise<void>[] = [];
        for (const f of files) {
            const p = new Promise<void>((res) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    let readerResult = <string>reader.result;
                    let resultData = readerResult;
                    if (readMode == 'url') {
                        resultData = readerResult.split(',', 2)[1];
                    }

                    results.push({ name: f.name, data: resultData, size: resultData.length });
                    res();
                };
                switch (readMode) {
                    case 'text':
                        reader.readAsText(f);
                        break;
                    case 'url':
                        reader.readAsDataURL(f);
                        break;
                    default:
                        reader.readAsBinaryString(f);
                        break;
                }
            });
            ps.push(p);
        }
        await Promise.all(ps);
        resolve(results);
    });
}

export async function exportData(data: string, fileName: string, fileType: string = null, caseSensitive: boolean = false): Promise<string> {
    let file = fileName.replace(/[&\\#,+()$~%'":*?<>{}]/g, '').replaceAll('/', '_');
    if (!caseSensitive) file = file.toLowerCase();
    file += (fileType ? '.' + fileType : '');

    let mimeType = 'application/octet-stream';

    switch (fileType) {
        case 'json':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'application/json';
            break;
        case 'csv':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'text/csv;charset=utf-8;';
            break;
        case 'txt':
        case 'log':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'text/plain;charset=utf-8;';
            break;
        case 'xml':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'text/xml;charset=utf-8;';
            break;
        default:
            const array = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
                array[i] = data.charCodeAt(i);
            }
            data = <any>array;
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.style.display = 'none';
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return file;
}

function articleTable() {
    const at = new ArticleTable();
    at.title = "article";
    at.setAttribute('dock-spawn-panel-type', 'document');
    at.setAttribute('dock-spawn-hide-close-button', '');
    dock.appendChild(at);
}

function soldTable() {
    const at = new SoldTable();
    at.title = "sold";
    at.setAttribute('dock-spawn-panel-type', 'document');
    at.setAttribute('dock-spawn-hide-close-button', '');
    dock.appendChild(at);
}

function configPage() {
    const at = new ConfigPage();
    at.title = "config";
    at.setAttribute('dock-spawn-panel-type', 'document');
    at.setAttribute('dock-spawn-hide-close-button', '');
    dock.appendChild(at);
}

requestAnimationFrame(() => {
    if (applicationConfig.screens.length > 0)
        newDocument(applicationConfig.screens[0].html, applicationConfig.screens[0].style);
    else
        newDocument('', style);
    articleTable();
    soldTable();
    configPage();
})