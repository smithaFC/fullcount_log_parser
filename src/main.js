require('module-alias/register');
const { app } = require('electron');
const { createWindow } = require('./electronConfig/electronWindow');
app.whenReady().then(() => {
	createWindow();
});
