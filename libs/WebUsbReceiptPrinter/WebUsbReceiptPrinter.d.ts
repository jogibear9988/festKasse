export default WebUsbReceiptPrinter;
declare class WebUsbReceiptPrinter {
    _internal: {
        emitter: e;
        device: any;
        profile: any;
    };
    connect(): Promise<void>;
    reconnect(e: any): Promise<void>;
    open(e: any): Promise<void>;
    disconnect(): Promise<void>;
    print(e: any): Promise<void>;
    addEventListener(e: any, n: any): void;
}
declare class e {
    constructor(e: any);
    _events: {};
    on(e: any, n: any): void;
    emit(e: any, ...n: any[]): void;
}
