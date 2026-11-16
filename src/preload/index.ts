import { contextBridge, ipcRenderer } from 'electron';
import { createLGX } from '../runtime/lgx.js';

const allowed = new Set(['lgx:notify', 'lgx:open-window', 'lgx:net-fetch']);
const lgx = createLGX({ siteVer: '', settings: () => ({}), log: () => undefined, ipc: (channel, value) => { if (!allowed.has(channel)) return Promise.reject(new Error('ipc-channel-denied')); return ipcRenderer.invoke(channel, value); } });
contextBridge.exposeInMainWorld('LGX', lgx);
