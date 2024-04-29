import '../controls/controls.js';
import { applicationConfig } from '../applicationConfig.js';
import { cssFromString } from '@node-projects/base-custom-webcomponent';
import { applicationState } from '../applicationState.js';
import { Signal } from 'signal-polyfill';
navigator.serviceWorker.register("./runtime-worker.js");
const edit = document.getElementById('edit');
edit.onclick = () => {
    document.location = "config.html";
};
const container = document.getElementById('container');
const shadowRoot = container.attachShadow({ mode: 'open' });
for (const art of applicationConfig.articles)
    applicationState.articles.set(art.key, new Signal.State(0));
const screen = applicationConfig.screens[0];
shadowRoot.adoptedStyleSheets = [cssFromString(screen.style)];
shadowRoot.innerHTML = screen.html;
