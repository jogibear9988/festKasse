import ThermalPrinterEncoder from '../../libs/ThermalPrinterEncoder/thermal-printer-encoder.esm.js';
import WebBluetoothReceiptPrinter from '../../libs/WebBluetoothReceiptPrinter/WebBluetoothReceiptPrinter.js';
import { IArticle } from '../StorageData.js';
import { applicationConfig } from '../applicationConfig.js';

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

        let encoder = new ThermalPrinterEncoder({
            language: printerLanguage,
            codepageMapping: printerCodepageMapping
        });
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
            .encode();

        await receiptPrinter.print(data);
    } catch (err) {
        console.error(err);
    }
};