const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const i18nextBackend = require("i18next-electron-fs-backend");
const Store = require("secure-electron-store").default;
// const ContextMenu = require("secure-electron-context-menu").default;
const SecureElectronLicenseKeys = require("secure-electron-license-keys");

// Create the electron store to be made available in the renderer process
const store = new Store();

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer, process),
  store: store.preloadBindings(ipcRenderer, fs),
  // contextMenu: ContextMenu.preloadBindings(ipcRenderer),
  licenseKeys: SecureElectronLicenseKeys.preloadBindings(ipcRenderer),

  send: (channel, data) => 
  {
    // whitelist channels
    // let validChannels = ["historyToMain"];
    // if (validChannels.includes(channel)) 
    // {
        ipcRenderer.send(channel, data);
    // }
  },
  receive: (channel, func) => {
    // let validChannels = ["historyFromMain"];
    // if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    // }
  },
  pushClipToDB : (data) =>
  {
    ipcRenderer.send('pushClip', data);
  },
  findClipFromDB: async () =>
  {
    try
    {
      const data = await ipcRenderer.invoke('fetch-data');
      return data
    }
    catch (error)
    {
      console.log("PRELOAD ERROR FINDCLIPFROMDB", error)
    }
  },
  search: async (term) => await ipcRenderer.invoke('search', term),
  deleteClip: async (term) => await ipcRenderer.invoke('deleteClip', term),
  paste: (text) =>
  {
    ipcRenderer.send("close-me", text);
  },
  exit: () => {ipcRenderer.send('exit')},
  close: () =>
  {
    ipcRenderer.send("close");
  },
  getClipboard: () => ipcRenderer.invoke('getLatestClipboard'),
  addToSearch: async (clip) => await ipcRenderer.invoke('addToSearch', clip),

});



