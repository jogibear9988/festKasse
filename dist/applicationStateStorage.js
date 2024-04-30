const configName = "festKasseSold";
export function getSoldConfig() {
    const data = localStorage.getItem(configName);
    let applicationSoldConfig = [];
    if (data) {
        applicationSoldConfig = JSON.parse(data);
    }
    return applicationSoldConfig;
}
export function saveSoldConfig(config) {
    const data = JSON.stringify(config);
    localStorage.setItem(configName, data);
}
export function clearSoldConfig() {
    localStorage.removeItem(configName);
}
