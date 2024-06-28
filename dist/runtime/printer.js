import ThermalPrinterEncoder from '../../libs/ThermalPrinterEncoder/thermal-printer-encoder.esm.js';
import WebBluetoothReceiptPrinter from '../../libs/WebBluetoothReceiptPrinter/WebBluetoothReceiptPrinter.js';
import WebUsbReceiptPrinter from '../../libs/WebUsbReceiptPrinter/WebUsbReceiptPrinter.js';
import { applicationConfig } from '../applicationConfig.js';
import { getSoldConfig, saveSoldConfig } from '../applicationStateStorage.js';
let printerLanguage;
let printerCodepageMapping;
let receiptPrinter;
export function getPrinter() {
    if (applicationConfig.config.printer == 'usb')
        return new WebUsbReceiptPrinter;
    else
        return new WebBluetoothReceiptPrinter;
}
export async function printOnPrinter(articles) {
    try {
        if (!receiptPrinter) {
            receiptPrinter = getPrinter();
            receiptPrinter.addEventListener('connected', device => {
                console.log(`Connected to ${device.name} (#${device.id})`);
                printerLanguage = device.language;
                printerCodepageMapping = device.codepageMapping;
            });
            receiptPrinter.addEventListener('disconnected', device => {
                console.log(`Disconnected to ${device.name} (#${device.id})`);
            });
            await receiptPrinter.connect();
        }
        const encoder = new ThermalPrinterEncoder({
            language: printerLanguage ?? 'esc-pos',
            codepageMapping: printerCodepageMapping ?? 'zjiang'
        });
        let data = encoder
            //@ts-ignore
            .initialize()
            .codepage(applicationConfig.config.codepage);
        for (let article of articles) {
            let solds = getSoldConfig();
            let sold = solds.find(x => x.key === article.key);
            if (!sold) {
                sold = { key: article.key, count: 0 };
                solds.push(sold);
            }
            sold.count += 1;
            saveSoldConfig(solds);
            data = data.newline()
                .text(article.name.padEnd(42, ' ') + (article.price / 100).toFixed(2) + ' ' + applicationConfig.config.currency)
                .newline()
                .newline()
                .newline()
                .newline()
                .text(applicationConfig.config.header)
                .newline()
                .newline()
                .cut();
        }
        await receiptPrinter.print(data.encode());
    }
    catch (err) {
        alert(err);
        console.error(err);
    }
}
;
export async function openRegister() {
    try {
        if (!receiptPrinter) {
            receiptPrinter = getPrinter();
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
        let data = encoder
            //@ts-ignore
            .initialize()
            .codepage(applicationConfig.config.codepage)
            .pulse(0)
            .encode();
        await receiptPrinter.print(data);
    }
    catch (err) {
        alert(err);
        console.error(err);
    }
}
;
