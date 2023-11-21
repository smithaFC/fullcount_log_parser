const path = require('path');

var LocalStorage = require('node-localstorage').LocalStorage;
ls = new LocalStorage('./store');
global.localStorage = ls;
const CONSTANT_KEYS = {
	LOG_DIR: 'logDirectory',
	PARSED_DIR: 'parsedDirectory',
	LAST_KEYWORDS: 'keywords',
};

function firstTimeRun() {
	const hasStoreCreated = getParsedFileDirectory();
	if (!hasStoreCreated) {
		ls.setItem(CONSTANT_KEYS.LOG_DIR, '');
		ls.setItem(CONSTANT_KEYS.PARSED_DIR, '');
		ls.setItem(CONSTANT_KEYS.LAST_KEYWORDS, '');
	}
}
firstTimeRun();
function getRootPath() {
	return path.join(__dirname, '../');
}

function getLogDirectory() {
	return ls.getItem(CONSTANT_KEYS.LOG_DIR);
}

function getParsedFileDirectory() {
	return ls.getItem(CONSTANT_KEYS.PARSED_DIR);
}

function updateLogDirectory(fileDir) {
	ls.setItem(CONSTANT_KEYS.LOG_DIR, path.resolve(fileDir));
}

function updateParsedDirectory(fileDir) {
	ls.setItem(CONSTANT_KEYS.PARSED_DIR, path.resolve(fileDir));
}

function getLastUsedParams() {
	const value = ls.getItem(CONSTANT_KEYS.LAST_KEYWORDS);
	if (value) {
		return JSON.parse(value);
	}
	return '';
}

function setLastUsedParams(params) {
	return ls.setItem(CONSTANT_KEYS.LAST_KEYWORDS, JSON.stringify(params));
}

module.exports = {
	getRootPath,
	getLogDirectory,
	getParsedFileDirectory,
	updateLogDirectory,
	updateParsedDirectory,
	getLastUsedParams,
	setLastUsedParams,
	CONSTANT_KEYS,
};
