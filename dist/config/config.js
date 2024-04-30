import { DocumentContainer, PreDefinedElementsService } from "@node-projects/web-component-designer";
import createDefaultServiceContainer from "./setupDesigner.js";
import '../controls/controls.js';
import 'dock-spawn-ts/lib/js/webcomponent/DockSpawnTsWebcomponent.js';
import '@node-projects/web-component-designer';
import './styleEditor.js';
import './article-table.js';
import { ArticleTable } from "./article-table.js";
import { applicationConfig, saveConfig } from "../applicationConfig.js";
import { SoldTable } from "./sold-table.js";
const serviceContainer = createDefaultServiceContainer();
serviceContainer.register('elementsService', new PreDefinedElementsService('demo', {
    elements: [
        "book-button",
        "action-button",
        "display-price"
    ]
}));
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
}`;
//clear cache??
//const cache = await caches.open(cacheName);
const dock = document.getElementById('dock');
const paletteView = document.getElementById('palette');
const propertyGrid = document.getElementById('propertyGrid');
const styleEditor = document.getElementById('styleEditor');
paletteView.loadControls(serviceContainer, serviceContainer.elementsServices);
propertyGrid.serviceContainer = serviceContainer;
dock.dockManager.addLayoutListener({
    onActiveDocumentChange: (manager, panel) => {
        if (panel) {
            let element = dock.getElementInSlot(panel.elementContent);
            if (element && element instanceof DocumentContainer) {
                let sampleDocument = element;
                styleEditor.model = sampleDocument.additionalData?.model;
                propertyGrid.instanceServiceContainer = sampleDocument.instanceServiceContainer;
            }
        }
    },
    onClosePanel: (manager, panel) => {
        if (panel) {
            let element = dock.getElementInSlot(panel.elementContent);
            if (element && element instanceof DocumentContainer) {
                element.dispose();
            }
        }
    }
});
function newDocument(code, style) {
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
                clearTimeout(timer);
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
    const save = document.getElementById('save');
    save.onclick = () => {
        applicationConfig.screens = [{
                html: screen.content,
                style: model.getValue()
            }];
        saveConfig();
    };
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
requestAnimationFrame(() => {
    if (applicationConfig.screens.length > 0)
        newDocument(applicationConfig.screens[0].html, applicationConfig.screens[0].style);
    else
        newDocument('', style);
    articleTable();
    soldTable();
});
