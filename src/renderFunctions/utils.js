const { getRootPath } = require('../utils');
const path = require('path');

function updatePathToLogFiles(newFilePath) {
	const absolutePath = path.resolve(newFilePath);
	localStorage.setItem('logDirectory');
}
