import ThermalPrinterEncoder from '../../libs/ThermalPrinterEncoder/thermal-printer-encoder.esm.js';
import WebBluetoothReceiptPrinter from '../../libs/WebBluetoothReceiptPrinter/WebBluetoothReceiptPrinter.js';
import { applicationConfig } from '../applicationConfig.js';
let printerLanguage;
let printerCodepageMapping;
let receiptPrinter;
export async function printOnPrinter(article) {
    try {
        if (!receiptPrinter) {
            receiptPrinter = new WebBluetoothReceiptPrinter();
            receiptPrinter.addEventListener('connected', device => {
                alert(`Connected to ${device.name} (#${device.id})`);
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
    }
    catch (err) {
        alert(err);
        console.error(err);
    }
}
;
