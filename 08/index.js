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
		processFile(data.split('\n'), task1);
	} else {
		processFile(data.split('\n'), task2);
	}
});


function processFile (data, fun) {
	const myMap = [];
	for(let line of data) {
		myMap.push(line.split('').map(v => parseInt(v)));
	}

	const N = myMap[0].length;
	const M = myMap.length;

	fun(myMap, N, M);
}

function task2 (myMap, N, M) {
	const scenic = myMap.map(row => row.map( v => 0) );
	let max = 0;
	for(let i=1; i<M-1; i++) {
		for(let j=1; j<N-1; j++) {
			scenic[i][j] = computeScenicScore(myMap, i,j,M,N);
			max = Math.max(max, scenic[i][j]);
		}
	}

	printMap(myMap);
	console.log('------------------');
	printMap(scenic);	
	
	console.log(`R t2=\n${max}\n`);
}

function computeScenicScore(myMap, i,j,M,N) {	
	const v = myMap[i][j]
	let topScore = 1;
	while(i-topScore > 0 && v > myMap[i-topScore][j]) {
		topScore ++;
	}
	let leftScore = 1;
	while(j-leftScore > 0 && v>myMap[i][j-leftScore]) {
		leftScore ++;
	}
	let bottomScore = 1;
	while(i+bottomScore < M-1 && v > myMap[i+bottomScore][j]) {
		bottomScore ++;
	}
	let rightScore = 1;
	while(j+rightScore < N-1 && v > myMap[i][j+rightScore]) {
		rightScore ++;
	}

	return topScore * leftScore * bottomScore * rightScore;
}

function task1 (myMap, N, M) {
	printMap(myMap);

	const visible = myMap.map(row => row.map( v => false) );

	setBorder(visible, N, M);
	
	for(let i=1; i<N -1; i++) {
		let currMax = myMap[i][0];
		for( let j=1; j<M-1; j++) {
			// console.log({s: 'A', i, j, v: myMap[i][j], currMax, visible: visible[i][j], op: myMap[i][j] > currMax });
			visible[i][j] ||= myMap[i][j] > currMax;
			currMax = Math.max(currMax, myMap[i][j]);			
		}
	}
	printVisibleMap(visible);

	for(let i=1; i<N-1; i++) {
		let currMax = myMap[i][N-1];
		for( let j=N-2; j>0; j--) {
			// console.log({ s: 'B',i, j, v: myMap[i][j], currMax, visible: visible[i][j], op: myMap[i][j] > currMax });
			visible[i][j] ||= myMap[i][j] > currMax;
			currMax = Math.max(currMax, myMap[i][j]);			
		}
	}
	printVisibleMap(visible);

	for(let j=1; j<M-1; j++) {
		let currMax = myMap[0][j];
		for( let i=1; i<N-1; i++) {	
			// console.log({ s: 'C',i, j, v: myMap[i][j], currMax, visible: visible[i][j], op: myMap[i][j] > currMax });
			visible[i][j] ||= myMap[i][j] > currMax;
			currMax = Math.max(currMax, myMap[i][j]);			
		}
	}
	printVisibleMap(visible);

	for(let j=1; j<M-1; j++) {
		let currMax = myMap[N-1][j];
		for( let i=N-2; i>0; i--) {	
			console.log({ s: 'D',i, j, v: myMap[i][j], currMax, visible: visible[i][j], op: myMap[i][j] > currMax });
			visible[i][j] ||= myMap[i][j] > currMax;
			currMax = Math.max(currMax, myMap[i][j]);			
		}
	}
	printVisibleMap(visible);

	const total = visible.reduce((acc, row) => acc + row.filter(v => v).length, 0);

	console.log(`R t1=\n${total}\n`);
}

function setBorder (visibleMap, N, M) {
	for(let i=0; i<N; i++) {
		visibleMap[0][i] = true;
		visibleMap[M-1][i] = true;
	}
	for(let i=1; i<M-1; i++) {
		visibleMap[i][0] = true;
		visibleMap[i][N-1] = true;
	}
}

function printMap(map) {
	for(let i=0; i<map.length; i++) {
		console.log(map[i].join(' '));
	}
}

function printVisibleMap (myMap) {
	console.log('-----------------------');
	for(let i=0; i<myMap.length; i++) {
		console.log(myMap[i].map(v => v ? 'T' : 'F').join(' '));
	}
}
