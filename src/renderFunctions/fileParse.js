// File parser
const { getLogDirectory, getParsedFileDirectory } = require('../utils');
const fs = require('fs');
const readline = require('readline');

let LOG_DIRECTORY = 'C:\\Users\\AdamSmith\\Desktop\\logs';
let PARSE_DIRECTORY = 'C:\\Users\\AdamSmith\\Desktop\\parsed';

// KEY WORDS TO FIND IN FILES R52K20LNLLJ , 'communityId-2010 '
let KEY_WORDS = [];

const findFiles = () => {
	const filesFound = [];
	fs.readdirSync(LOG_DIRECTORY).forEach((file) => {
		filesFound.push(`${LOG_DIRECTORY}\\${file}`);
	});
	return filesFound;
};

const parseFiles = async () => {
	const logFiles = findFiles();

	if (logFiles.length < 1) {
		console.log(`No files found in: ${LOG_DIRECTORY}`);
		return;
	}
	console.log('starting');
	const parsed = await Promise.all(
		logFiles.map(async (filedir, index) => {
			console.log(`Starting to parse: ${filedir}`);
			return parse(filedir, index);
		})
	);

	console.log('finished');
};
const parse = async (dir, index) => {
	const parsed = [];
	const parsedFileName = dir.substring(LOG_DIRECTORY.length + 1, dir.length);
	const newFileDir = `${PARSE_DIRECTORY}\\parsed_${parsedFileName}.txt`;
	fs.writeFileSync(newFileDir, '');
	const newFile = fs.openSync(newFileDir);
	const fileStream = fs.createReadStream(dir);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});
	let dwrError = false;
	let indexOfDwr = 0;
	let dwrErrorArray = [];
	for await (const line of rl) {
		if (line.indexOf('DWR EXCEPTION {') !== -1 && dwrError === false) {
			dwrError = true;
		}
		if (dwrError) {
			dwrError = true;
			if (indexOfDwr <= 3) {
				dwrErrorArray.push(line);
			}
			if (indexOfDwr === 3) {
				for (const key in KEY_WORDS) {
					const wrd = KEY_WORDS[key];
					if (line.indexOf(wrd) !== -1) {
						dwrErrorArray.forEach((er) => fs.appendFileSync(newFileDir, er + '\r'));
						break;
					}
				}
			}
			indexOfDwr++;
			if (indexOfDwr < 4) {
				continue;
			}
			dwrErrorArray = [];
			indexOfDwr = 0;
			dwrError = false;
		}
		// Each line in input.txt will be successively available here as `line`.
		for (const key in KEY_WORDS) {
			if (line.indexOf(KEY_WORDS[key]) !== -1) {
				const writeLine = line + '\r';
				fs.appendFileSync(newFileDir, writeLine);
				break;
			}
		}
	}
	return parsed;
};

/**
 *
 * @param {*} logDir
 * @param {*} parsedDir
 * @param {*} keyWords
 * @returns
 */
async function logParse(keyWords) {
	LOG_DIRECTORY = getLogDirectory();
	PARSE_DIRECTORY = getParsedFileDirectory();

	KEY_WORDS = keyWords;
	return await parseFiles();
}

module.exports = { logParse };
