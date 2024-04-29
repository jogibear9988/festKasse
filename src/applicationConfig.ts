import { IArticle, IPrintConfig, IScreen, IStorageData } from "./StorageData.js"

const configName = "festKasse";

export let applicationConfig: IStorageData = {
    articles: [],
    screens: [],
    printConfig: {},
    config: {
        currency: '€'
    }
};

let data = localStorage.getItem(configName);
//data=`{"articles":[{"key":"cola","name":"Cola, Fanta, Spezi","price":200},{"key":"wasser","name":"Wasser (0.5)","price":200},{"key":"haenchen","name":"Hähnchen","price":750},{"key":"pommes","name":"Pommes","price":400}],"screens":[{"html":"<book-button article=\"wasser\" style=\"grid-column:1;grid-row:1;grid-column-start:1;grid-column-end:3;grid-row-start:1;grid-row-end:3;\"></book-button>\n<book-button article=\"wasser\" style=\"grid-column:1;grid-row:3;grid-column-start:1;grid-column-end:3;grid-row-start:3;grid-row-end:5;\"></book-button>\n<book-button article=\"haenchen\" style=\"grid-column:4;grid-row:1;grid-column-start:4;grid-column-end:6;grid-row-start:1;grid-row-end:3;\"></book-button>\n<book-button article=\"pommes\" style=\"grid-column:4;grid-row:3;grid-column-start:4;grid-column-end:6;grid-row-start:3;grid-row-end:5;\"></book-button>\n","style":"\n:host {\n    box-sizing: border-box;\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n    gap: 10px;\n    padding: 10px;\n    background: black;\n    user-select: none;\n}\n\n* {\n    font-family: 'Courier New', Courier, monospace;\n    user-select: none;\n}\n\nbook-button {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background: #222222;\n    color: white;\n    border: 1px solid white;\n    cursor: pointer;\n}\n\naction-button {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background: lightgray;\n    color: black;\n    font-weight: 900;\n    border: 1px solid white;\n    cursor: pointer;\n}\n\naction-button[active] {\n    background: red;\n}"}],"printConfig":{},"config":{"currency":"€"}}`
if (data) {
    const loadedConfig = JSON.parse(data);
    loadedConfig.config = { ...applicationConfig.config, ...loadedConfig.config };
    applicationConfig = loadedConfig
}

export function saveConfig() {
    const data = JSON.stringify(applicationConfig)
    localStorage.setItem(configName, data);
}
