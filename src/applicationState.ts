import { Signal } from "signal-polyfill"

class ApplicationState {
    constructor() {

    }

    storno = new Signal.State(false);
    articles = new Map<string, Signal.State<number>>();
}

export const applicationState = new ApplicationState()