export { n as default };
declare class n {
    _internal: {
        emitter: e;
        queue: t;
        device: any;
        characteristic: any;
        profile: any;
    };
    connect(): Promise<void>;
    reconnect(e: any): Promise<void>;
    open(e: any): Promise<void>;
    disconnect(): Promise<void>;
    print(e: any): Promise<any>;
    addEventListener(e: any, t: any): void;
}
declare class e {
    constructor(e: any);
    _events: {};
    on(e: any, t: any): void;
    emit(e: any, ...t: any[]): void;
}
declare class t {
    _queue: any[];
    _working: boolean;
    add(e: any): void;
}
