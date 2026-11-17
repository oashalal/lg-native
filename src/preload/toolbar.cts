import { contextBridge, ipcRenderer } from 'electron';

type ToolbarAction = 'back' | 'forward' | 'reload' | 'settings' | 'status';
type TabAction = 'new-temp' | 'new' | 'save-current-profile' | 'rename-profile' | 'delete-profile' | 'activate' | 'close' | 'menu-open' | 'menu-close';
const isString = (value: unknown): value is string => typeof value === 'string' && value.length <= 256;
contextBridge.exposeInMainWorld('lgNativeToolbar', {
  action: (action: ToolbarAction) => ipcRenderer.invoke('lgx:toolbar', action),
  tabs: (action: TabAction, value?: string, name?: string, height?: number) => {
    if (value !== undefined && !isString(value)) throw new Error('invalid-tabs-value');
    if (name !== undefined && (!isString(name) || name.trim().length === 0)) throw new Error('invalid-profile-name');
    if (height !== undefined && (!Number.isFinite(height) || height < 0 || height > 1000)) throw new Error('invalid-menu-height');
    return ipcRenderer.invoke('lgx:tabs', { action, value, name, height });
  },
});
