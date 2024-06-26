import { Signal } from "signal-polyfill";
class ApplicationState {
    constructor() { }
    storno = new Signal.State(false);
    articles = new Map();
    payedString = new Signal.State('0');
    payed = new Signal.Computed(() => parseInt(this.payedString.get()) / 100);
    remaining;
    price;
}
export const applicationState = new ApplicationState();
