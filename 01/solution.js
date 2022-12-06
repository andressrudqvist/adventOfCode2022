const fs = require('fs');
const inputFileName = './input';

function process (err, data) {
	if(err) {
		console.error(err);
		return -1;
	} else {
		let maxElf = 0;
		let currentElf = 0;
		let elfInventory = [];		
		for (let line of data.split('\n')) {
			// console.log(`line = ${line} n=${parseInt(line)}`);
			if(line === "") {
				if ( currentElf > maxElf) {
					maxElf = currentElf;
				}
				elfInventory.push(currentElf);
				currentElf = 0;
			} else {
				currentElf += parseInt(line);
			}
		}
		console.log(`maxElf = ${maxElf}`);

		// console.log(elfInventory);
		console.log(elfInventory.sort((a, b) => b-a));
		console.log(elfInventory.sort((a, b) => b-a).slice(0,3));
		console.log(elfInventory.sort((a, b) => b-a).slice(0,3).reduce((a,b) => a + b));
	}
}

fs.readFile(inputFileName, 'utf-8', process);