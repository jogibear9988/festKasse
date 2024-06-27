const configName = "festKasse";
export let applicationConfig = {
    articles: [],
    screens: [],
    printConfig: {},
    config: {
        currency: '€',
        codepage: 'cp858',
        header: '                  Mein Fest',
        depositText: 'Pfand'
    }
};
let data = localStorage.getItem(configName);
if (data) {
    const loadedConfig = JSON.parse(data);
    loadedConfig.config = { ...applicationConfig.config, ...loadedConfig.config };
    applicationConfig = loadedConfig;
}
export function saveConfig() {
    const data = JSON.stringify(applicationConfig);
    localStorage.setItem(configName, data);
}
