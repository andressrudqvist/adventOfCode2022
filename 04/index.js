const fs = require('fs');
const proccess = require('process')
// const inputFileName = './demoInput';
const inputFileName = proccess.argv[2];

console.log(`Processing: ${inputFileName}`);

fs.readFile(inputFileName, 'utf-8', (err, data) => {
	if(err) {
		console.error(err);
		return -1;
	} else {
		process(data.split('\n'));
	}
});

function process (data) {
	let sum = [0, 0];
	for(let pair of data) {
		if(pair !== '') {
			const parts = pair.split(/(\d+)\-(\d+),(\d+)\-(\d+)/);
			if (parts && parts.length > 0) {
				// console.log(`${parts} ... ${parts.length}`);
				const [t1, t2] = isFullOverlap(
					parseInt(parts[1]),
					parseInt(parts[2]),
					parseInt(parts[3]),
					parseInt(parts[4])
				);
				sum[0] += t1;
				sum[1] += t2;
			}
		}
	}
	console.log(`Sum of containing regions:\n${sum}\n`);
}

function isFullOverlap(a, b, c, d) {	
	let task1 = 0;
	let task2 = 0;
	if( (a<=c && b>=d) || (c<=a && d>=b)) {
		task1 ++;
		task2 ++
	} else if( (c<=b && b<=d) || (c<=a && d>=a))  {
		task2 ++;
	}

	console.log(`${a}-${b}, ${c}-${d} => [${task1} | ${task2}]`);
	// console.log(`${c>=a} ${c<=b} => ${c>=a && c<=b} || ${a<=c} ${a<=d} => ${(a<=c && a<=d)}`);
	return [task1, task2];
}