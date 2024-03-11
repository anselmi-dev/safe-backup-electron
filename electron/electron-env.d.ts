/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

interface ElectronAPI {
  openDialogDirectory: () => Promise<any>;
  dbDirectories: () => Promise<any>;
  directoryBackup: (directory: any) => Promise<any>;
  dbDirectoryWrite: (directories: any) => Promise<any>;
  dbDirectoryUpdate: (directory: any) => Promise<any>;
  dbDirectoryCreate: (directory: any) => Promise<any>;
  dbDirectoryDestroy: (directory: any) => Promise<any>;
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI: ElectronAPI
}
