let retry = 3;
try {
	const information = document.getElementById('info');
	information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

	const BUTTONS = {
		updateLogLocation: document.getElementById('logFileUpdaterBtn'),
		updateParsedLocation: document.getElementById('parsedFileUpdaterBtn'),
		submitBtn: document.getElementById('submit'),
	};

	const INPUTS = {
		textArea: document.getElementById('textArea'),
	};

	const LABELS = {
		logLoc: document.getElementById('logFileLoc'),
		status: document.getElementById('status'),
		parsedLoc: document.getElementById('parsedFileLoc'),
		loading: document.getElementById('loadingSpan'),
	};
	LABELS.logLoc.innerHTML = FullCount.logsFilePath();
	LABELS.parsedLoc.innerHTML = FullCount.parsedFilePath();
	INPUTS.textArea.value = FullCount.getLastUsedParams();

	BUTTONS.updateLogLocation.addEventListener('click', () => {
		const result = FullCount.openLogUpdaterDialog();
		LABELS.logLoc.innerHTML = result;
	});

	BUTTONS.updateParsedLocation.addEventListener('click', () => {
		const result = FullCount.openParsedDialog();
		LABELS.parsedLoc.innerHTML = result;
	});

	BUTTONS.submitBtn.addEventListener('click', parse);

	async function parse() {
		const initValue = INPUTS.textArea.value;
		const newVal = initValue.split(',');
		const trimmed = newVal.map((val) => val.trim());
		BUTTONS.submitBtn.style.display = 'none';
		LABELS.loading.style.display = 'block';
		LABELS.status.innerHTML = 'Parsing logs, this could take a second..';
		FullCount.setLastUsedParams(initValue);
		await FullCount.beginParse(trimmed);
		LABELS.loading.style.display = 'none';
		BUTTONS.submitBtn.style.display = 'block';
		LABELS.status.innerHTML = 'Successfully finished parsing!';
		FullCount.openParsedFolder();
	}
} catch (e) {
	if (retry > 0) {
		retry = retry - 1;
		window.location.reload();
	}
}
