const { BrowserWindow, dialog, app, ipcMain } = require('electron');
const path = require('path');
const { getRootPath, updateLogDirectory, updateParsedDirectory } = require('../utils');
let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 500,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	});
	global.mainWindow = mainWindow;
	const urlToPage = path.join(getRootPath(), '/pages/landingPage.html');
	mainWindow.loadFile(urlToPage);
	updateLogFileLocation();
}

function updateLogFileLocation() {
	ipcMain.on('update-log-directory', (e, args) => {
		dialog
			.showOpenDialog(mainWindow, {
				message: 'Choose where log files are located',
				buttonLabel: 'choose directory',
				defaultPath: app.getPath('desktop'),
				properties: ['openDirectory'],
			})
			.then((result) => {
				const { filePaths } = result;
				if (filePaths.length > 0) {
					updateLogDirectory(filePaths[0]);
					e.returnValue = filePaths[0];
				}
			});
	});

	ipcMain.on('update-parsed-directory', (e, args) => {
		dialog
			.showOpenDialog(mainWindow, {
				message: 'Choose where parsed output should go',
				buttonLabel: 'choose directory',
				defaultPath: app.getPath('desktop'),
				properties: ['openDirectory'],
			})
			.then((result) => {
				const { filePaths } = result;
				if (filePaths.length > 0) {
					updateParsedDirectory(filePaths[0]);
					e.returnValue = filePaths[0];
				}
			});
	});
}

module.exports = { createWindow };
