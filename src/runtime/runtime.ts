import '../controls/controls.js';
import { applicationConfig } from '../applicationConfig.js';
import { cssFromString } from '@node-projects/base-custom-webcomponent';

navigator.serviceWorker.register("./runtime-worker.js");

const edit = document.getElementById('edit') as HTMLButtonElement;
edit.onclick = () => {
    document.location = "config.html";
}

const container = document.getElementById('container') as HTMLDivElement;
const shadowRoot = container.attachShadow({ mode: 'open' });

const screen = applicationConfig.screens[0];
shadowRoot.adoptedStyleSheets = [cssFromString(screen.style)];
shadowRoot.innerHTML = screen.html;