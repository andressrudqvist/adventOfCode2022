const fs = require('fs');
// const inputFileName = './demoInput';
const inputFileName = './input';

fs.readFile(inputFileName, 'utf-8', process);

function process (err, data) {
	if(err) {
		console.error(err);
		return -1;
	} else {
		let total1 = 0;
		let total2 = 0;
		for (let line of data.split('\n')) {
			
			if (line.length > 2) {
				const [playA, playB] = line.split(' ');
				total1 += gameResult(playA.charCodeAt(0) - 64, playB.charCodeAt(0) - 87);
				total2 += gameStrategy(playA.charCodeAt(0) - 64, playB.charCodeAt(0) - 87);
			}
		}
		console.log(`Result =\n${total1}\n${total2}\n`);
	}
}

function gameResult (playA, playB) {
	let r = 0;	
	if ( playA - playB === 0) {
		r = 3;
	}
	else if ( playB - playA === 1 || playB - playA === -2) {
		r = 6;
	}
	// console.log(` ${playA} vs ${playB} => ${r}`);
	return r + playB;
}

function gameStrategy (playA, playB) {
	let r = (playB - 1) * 3
	console.log('r0 = ',r);
	if (playB === 1) { // lose
		r += lose(playA);
	} else if (playB == 2) { // draw
		r += playA;
	} else { // win
		r += win(playA);
	}
	console.log(`S: ${playA} vs ${playB} => ${r}`);
	return r;
}

function win(play) {
	switch(play) {
		case 1: return 2;
		case 2: return 3;
		case 3: return 1;
		default: throw Error('undefined win of ', play);
	}
}

function lose(play) {
	switch(play) {
		case 1: return 3;
		case 2: return 1;
		case 3: return 2;
		default: throw Error('undefined lose of ', play);
	}
}