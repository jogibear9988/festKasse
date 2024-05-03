import ThermalPrinterEncoder from '../../libs/ThermalPrinterEncoder/thermal-printer-encoder.esm.js';
import WebBluetoothReceiptPrinter from '../../libs/WebBluetoothReceiptPrinter/WebBluetoothReceiptPrinter.js';
import { IArticle } from '../StorageData.js';
import { applicationConfig } from '../applicationConfig.js';
import { getSoldConfig, saveSoldConfig } from '../applicationStateStorage.js';

let printerLanguage;
let printerCodepageMapping;
let receiptPrinter: WebBluetoothReceiptPrinter;
export async function printOnPrinter(article: IArticle) {
    try {
        if (!receiptPrinter) {
            receiptPrinter = new WebBluetoothReceiptPrinter();
            receiptPrinter.addEventListener('connected', device => {
                console.log(`Connected to ${device.name} (#${device.id})`);
                printerLanguage = device.language;
                printerCodepageMapping = device.codepageMapping;
            });
            await receiptPrinter.connect();
        }
        const encoder = new ThermalPrinterEncoder({
            language: printerLanguage ?? 'esc-pos',
            codepageMapping: printerCodepageMapping ?? 'zjiang'
        });

        let solds = getSoldConfig();
        let sold = solds.find(x => x.key === article.key);
        if (!sold) {
            sold = { key: article.key, count: 0 };
            solds.push(sold);
        }
        sold.count += 1;
        saveSoldConfig(solds);

        let data = encoder
            //@ts-ignore
            .initialize()
            .codepage(applicationConfig.config.codepage)
            .newline()
            .text(article.name.padEnd(42, ' ') + (article.price / 100).toFixed(2) + ' ' + applicationConfig.config.currency)
            .newline()
            .newline()
            .newline()
            .newline()
            .text(applicationConfig.config.header)
            .newline()
            .newline()
            .cut()
            .pulse(0)
            .encode();
        await receiptPrinter.print(data);
    } catch (err) {
        alert(err)
        console.error(err);
    }
};