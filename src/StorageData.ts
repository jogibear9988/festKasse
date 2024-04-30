export interface IArticle {
    key: string,
    name: string,
    print: string,
    price: number,
    deposit: number,

}

export interface IScreen {
    html: string,
    style: string
}

export interface IPrintConfig {
    printHeader?: string,
    printFooter?: string
}

export interface IConfig {
    currency: string,
    codepage: string,
    header: string,
    depositText: string,
}

export interface IStorageData {
    articles: IArticle[],
    screens: IScreen[],
    printConfig: IPrintConfig,
    config: IConfig,
}