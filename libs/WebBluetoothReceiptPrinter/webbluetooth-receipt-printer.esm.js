class e{constructor(e){this._events={}}on(e,t){this._events[e]=this._events[e]||[],this._events[e].push(t)}emit(e,...t){let i=this._events[e];i&&i.forEach((e=>{e(...t)}))}}class t{constructor(){this._queue=[],this._working=!1}add(e){let t=this;this._queue.push(e),this._working||async function e(){if(!t._queue.length)return void(t._working=!1);t._working=!0;let i=t._queue.shift();await i(),e()}()}}const i=[{filters:[{services:["000018f0-0000-1000-8000-00805f9b34fb"]}],service:"000018f0-0000-1000-8000-00805f9b34fb",characteristic:"00002af1-0000-1000-8000-00805f9b34fb",language:"esc-pos",codepageMapping:"zjiang"}];class n{constructor(){this._internal={emitter:new e,queue:new t,device:null,characteristic:null,profile:null},navigator.bluetooth.addEventListener("disconnect",(e=>{this._internal.device==e.device&&this._internal.emitter.emit("disconnected")}))}async connect(){try{let e=await navigator.bluetooth.requestDevice({filters:i.map((e=>e.filters)).reduce(((e,t)=>e.concat(t)))});e&&await this.open(e)}catch(e){console.log("Could not connect! "+e)}}async reconnect(e){if(!navigator.bluetooth.getDevices)return;let t=(await navigator.bluetooth.getDevices()).find((t=>t.id==e.id));t&&await this.open(t)}async open(e){this._internal.device=e;let t=await this._internal.device.gatt.connect(),n=await t.getPrimaryServices();this._internal.profile=i.find((e=>n.some((t=>e.service==t.uuid))));let a=await t.getPrimaryService(this._internal.profile.service),r=await a.getCharacteristic(this._internal.profile.characteristic);this._internal.characteristic=r,this._internal.emitter.emit("connected",{type:"bluetooth",name:this._internal.device.name,id:this._internal.device.id,language:this._internal.profile.language,codepageMapping:this._internal.profile.codepageMapping})}async disconnect(){this._internal.device&&(await this._internal.device.gatt.disconnect(),this._internal.device=null,this._internal.characteristic=null,this._internal.profile=null,this._internal.emitter.emit("disconnected"))}print(e){return new Promise((t=>{let i=Math.ceil(e.length/100);if(1===i){let t=e;this._internal.queue.add((()=>this._internal.characteristic.writeValue(t)))}else for(let t=0;t<i;t++){let i=100*t,n=Math.min(e.length,i+100),a=e.slice(i,n);this._internal.queue.add((()=>this._internal.characteristic.writeValue(a)))}this._internal.queue.add((()=>t()))}))}addEventListener(e,t){this._internal.emitter.on(e,t)}}export{n as default};