import { Signal } from "signal-polyfill"

class ApplicationState {
    constructor() { }

    readonly storno = new Signal.State(false);
    readonly articles = new Map<string, Signal.State<number>>();
    readonly payedString = new Signal.State('0');
    readonly payed = new Signal.Computed(() => parseInt(this.payedString.get()) / 100);
    
    readonly lastPrice = new Signal.State(0);
    readonly lastRemaining = new Signal.State(0);
    readonly clearOnNextBook = new Signal.State(false);

    remaining: Signal.Computed<number>;
    price: Signal.Computed<number>;
}

export const applicationState = new ApplicationState()