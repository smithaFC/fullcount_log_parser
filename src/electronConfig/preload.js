const { getLogDirectory, getParsedFileDirectory, setLastUsedParams, getLastUsedParams } = require('../utils');
const { logParse } = require('../renderFunctions/fileParse');
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('versions', {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	// we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('FullCount', {
	logsFilePath: () => getLogDirectory(),
	parsedFilePath: () => getParsedFileDirectory(),
	openLogUpdaterDialog: () => ipcRenderer.sendSync('update-log-directory'),
	openParsedDialog: () => ipcRenderer.sendSync('update-parsed-directory'),
	beginParse: async (keywords = []) => logParse(keywords),
	logFileUpdate: (fn) => ipcRenderer.on('update-log-directory', fn),
	getLastUsedParams: () => getLastUsedParams(),
	setLastUsedParams: (values) => setLastUsedParams(values),
	openParsedFolder: () => shell.openPath(getParsedFileDirectory()),
});
