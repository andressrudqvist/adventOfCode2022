const fs = require('fs');
const process = require('process')

const inputFileName = process.argv[2];
const task = process.argv[3] ?? 't1';

console.log(`Processing: ${inputFileName}`);

fs.readFile(inputFileName, 'utf-8', (err, data) => {
	if(err) {
		console.error(err);
		return -1;
	} else if(task === 't1') {
		processFile(data.split('\n'), (d) => findStart(d, 4));
	} else {
		processFile(data.split('\n'), (d) => findStart(d, 14));
	}
});

function processFile (data, fun) {
	let sum = 0;
	for(let code of data) {
		if (code !== '') {
			sum += fun(code.trim());
		}
	}
	console.log(`Res=\n${sum}\n`);
}

function findStart (code, len) {	
	let firstMaker = 1;

	while(firstMaker < code.length-2) {		
		const subsequence = code.slice(firstMaker-1, (len - 1)+firstMaker).split('');
		const areAllDifferent = allDifferent(subsequence);
		console.log(`[${code}][${firstMaker+(len-1)}] ${subsequence} => ${areAllDifferent}`);
		if (areAllDifferent) {
			console.log(`S=${subsequence}\t | R=${firstMaker+(len-1)}`);
			return firstMaker + 3;
		}
		firstMaker ++;
	}

	return 0;
}

function allDifferent (arr) {
	for (let i=0; i<arr.length; i++) {
		for(let j=i+1; j<arr.length; j++) {
			console.log(`Compare a[${i}] = ${arr[i]}\twith\ta[${j}]=${arr[j]} \t ${arr.length}`);
			if( arr[i] === arr[j]) {
				return false;
			}
		}
	}
	return true;
}