import '../controls/controls.js';
import { applicationConfig } from '../applicationConfig.js';
import { cssFromString } from '@node-projects/base-custom-webcomponent';
import { applicationState } from '../applicationState.js';
import { Signal } from 'signal-polyfill';

//navigator.serviceWorker.register("./runtime-worker.js");

const edit = document.getElementById('edit') as HTMLButtonElement;
edit.onclick = () => {
    document.location = "config.html";
}

const container = document.getElementById('container') as HTMLDivElement;
const shadowRoot = container.attachShadow({ mode: 'open' });

for (const art of applicationConfig.articles)
    applicationState.articles.set(art.key, new Signal.State(0));

applicationState.price = new Signal.Computed(() => {
    let summe = 0;
    for (let s of applicationState.articles) {
        const v = s[1].get();
        if (v > 0) {
            const article = applicationConfig.articles.find(x => x.key == s[0]);
            summe += v * ((article.price ?? 0) + (article.deposit ?? 0));
        }
    }
    return (summe / 100);
});

applicationState.remaining = new Signal.Computed(() => applicationState.payed.get() - applicationState.price.get());

const screen = applicationConfig.screens[0];
if (screen) {
    shadowRoot.adoptedStyleSheets = [cssFromString(screen?.style ?? '')];
    shadowRoot.innerHTML = screen?.html ?? '';
}