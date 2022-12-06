const fs = require('fs');
const process = require('process')

const inputFileName = process.argv[2];
const boardSize = parseInt(process.argv[3]);
const task = process.argv[4] ?? 't1';

if (!boardSize || Number.isNaN(boardSize)) {
	console.info(`Invoke node index.js <file> <boardSize> [t1|t2]`);
	process.exit(-1)
}

console.log(`Processing: ${inputFileName}`);

fs.readFile(inputFileName, 'utf-8', (err, data) => {
	if(err) {
		console.error(err);
		return -1;
	} else if(task === 't1') {
		processFile(data.split('\n'), moveContainers);
	} else {
		processFile(data.split('\n'), moveContainersT2);
	}
});

function processFile (data, fun) {
	let [board, n] = loadBoard(data);

	while(n < data.length) {
		if (data[n] !== '') {
			fun(board, data[n]);					
		}
		n ++;
	}
	printAnswer(board)
}

function loadBoard (data) {
	const board = initBoard();
	let n = 0;
	
	while (!data[n].match(/^\s+1\s+2\s+3/) ) {
		for (let i=0; i<boardSize; i++) {
			const box = data[n][1+i*4];
			if(box !== ' ') {
				board[i].unshift(box);
			}
		}
		n++;
	}
	printBoard(board);
	return [board, n+2];
}

function printAnswer(board) {
	console.log(`\n\nResult\n`);
	printBoard(board);

	const r = []
	for (let i=0; i<boardSize; i++)  {
		r.push(board[i].pop());
	}
	console.log('R => \n', r.join(''));
}

function moveContainersT2 (board, instruction) {
	console.log(`I=> ${instruction}`);
	const parts = instruction.match(/move\s+(\d+)\s+from\s+(\d+)\s+to\s+(\d+)/);
	const containers = parseInt(parts[1]);
	const from = parseInt(parts[2]) - 1;
	const to = parseInt(parts[3]) - 1;	

	let boxSet = []
	for (let i=0; i<containers; i++)  {
		boxSet.unshift(board[from].pop());
	}
	// console.log({ boxSet });
	board[to].push(...boxSet);
	
	printBoard(board);
}

function moveContainers(board, instruction) {
	console.log(`I=> ${instruction}`);
	const parts = instruction.match(/move\s+(\d+)\s+from\s+(\d+)\s+to\s+(\d+)/);
	const containers = parseInt(parts[1]);
	const from = parseInt(parts[2]) - 1;
	const to = parseInt(parts[3]) - 1;	

	for (let i=0; i<containers; i++)  {
		const box = board[from].pop();
		board[to].push(box);
	}
	
	printBoard(board);
}

function printBoard (board) {
	for (let i=0; i<boardSize; i++) {
		const boxes = board[i].map(b => ` [${b}]`).join('');
		console.log(`${i+1}\t${boxes}`);
	}
}

function initBoard() {
	const board = [];
	for (let i=0; i<boardSize; i++) {
		board.push([]);
	}
	return board;
}