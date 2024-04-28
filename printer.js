import ThermalPrinterEncoder from './libs/ThermalPrinterEncoder.js'; 
import WebBluetoothReceiptPrinter from './libs/WebBluetoothReceiptPrinter/webbluetooth-receipt-printer.esm.js';

const btn = document.getElementById('print');
btn.onclick = async () => {
    let options = {};
    options.acceptAllDevices = true;
    try {
        /*const device = await navigator.bluetooth.requestDevice(options);

        console.info('> Name:             ' + device.name);
        console.info('> Id:               ' + device.id);
        console.info('> Connected:        ' + device.gatt.connected);
        console.info(device);*/
        
        debugger;

        const receiptPrinter = new WebBluetoothReceiptPrinter();
        receiptPrinter.addEventListener('connected', device => {
            console.log(`Connected to ${device.name} (#${device.id})`);
        
            let printerLanguage = device.language;
            let printerCodepageMapping = device.codepageMapping;
        
            /* Store device for reconnecting */
            //lastUsedDevice = device;

            let encoder = new ThermalPrinterEncoder({
                language:  printerLanguage,
                codepageMapping: printerCodepageMapping
            });
            let data = encoder
                .initialize()
                .text('The quick brown fox jumps over the lazy dog\n\nHallo')
                .cut('partial')
                .newline()
                .newline()
                .newline()
                .qrcode('https://nielsleenheer.com')
                .newline()
                .newline()
                .cut()
                .encode();
            
            receiptPrinter.print(data);
        });

        await receiptPrinter.connect();
        /*const server = await device.gatt.connect();
		const services = await server.getPrimaryServices();

		const profile = DeviceProfiles.find(
			item => services.some(service => item.service == service.uuid)
		);

		const service = await server.getPrimaryService(profile.service);
		const characteristic = await service.getCharacteristic(profile.characteristic);*/


        


        //await this._internal.device.gatt.disconnect();

    } catch (err) {
        console.error(err);
    }
};