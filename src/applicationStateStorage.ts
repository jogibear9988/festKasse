import { IArticleSoldData } from "./StorageData.js"

const configName = "festKasseSold";

export function getSoldConfig() {
    const data = localStorage.getItem(configName);
    let applicationSoldConfig: IArticleSoldData[] = [];
    if (data) {
        applicationSoldConfig = JSON.parse(data);
    }
    return applicationSoldConfig;
}

export function saveSoldConfig(config: IArticleSoldData[]) {
    const data = JSON.stringify(config)
    localStorage.setItem(configName, data);
}

export function clearSoldConfig() {
    localStorage.removeItem(configName);
}
