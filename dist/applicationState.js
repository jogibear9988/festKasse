import { Signal } from "signal-polyfill";
class ApplicationState {
    constructor() {
    }
    storno = new Signal.State(false);
    articles = new Map();
}
export const applicationState = new ApplicationState();
