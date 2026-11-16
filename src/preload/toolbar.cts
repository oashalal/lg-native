import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('lgNativeToolbar', { action: (action: string) => ipcRenderer.invoke('lgx:toolbar', action) });
