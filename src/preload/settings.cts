import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('lgNativeSettings', {
  load: () => ipcRenderer.invoke('lgx:settings-load'),
  theme: () => ipcRenderer.invoke('lgx:settings-theme'),
  save: (values: unknown) => ipcRenderer.invoke('lgx:settings-save', values),
});
