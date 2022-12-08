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
		processFile(data.split('\n'), null);
	} else {
		processFile(data.split('\n'), null);
	}
});


function processFile (data, fun) {
	const tree = getDir('/', null);
	let current = tree;

	for (const line of data) {
		if (line !== '') {
			if (line === '$ ls') {
				//skip
			} else if (line.startsWith('$ cd /')) {
				current = tree;
			} else if(line.startsWith('$ cd ..')) {
				current = current.parent;
			} else if (line.startsWith('$ cd')) {
				const dirName = line.slice(5);
				const nd = getDirectory(current, dirName);
				// console.log(`Get directory(${current.name},${dirName}) => ${nd.name}`);
				current = nd;
			} else if (line.startsWith('dir')) {
				const dirName = line.slice(4);
				const dir = getDir(dirName, current);
				current.children.push(dir);
			} else if (line.startsWith('$')) {
				throw new Error(`Command unknown: ${line}`);
			} else {
				const elements = line.split(' ');
				const size = parseInt(elements[0]);
				const file = getFile(elements[1], current, size);
				current.children.push(file);
			}
		}
		// console.log('DD ', line)
		// printTree(tree);
		// console.log('----------------------', current.name);
	}
	computeSize(tree);
	printTree(tree);

	console.log(`R t1 =\n`,computeAtMostSize(tree,100000));

	const req = 30000000;
	const total = 70000000;
	const free = total - tree.size;
	const toFree = req - free;

	// I could use this for get the atMostSize ...
	const directorySizeList = getDirectorySizeList(tree, toFree);
	const t2Candidates = directorySizeList.filter(x => x>=toFree).sort((a,b) => a-b);
	console.log({ 
		req: req.toLocaleString(), 
		total: total.toLocaleString(), 
		free: free.toLocaleString(), 
		toFree: toFree.toLocaleString(), 
		t2Candidates: t2Candidates.map(v => v.toLocaleString()), 
		directorySizeList: directorySizeList.map(v => v.toLocaleString()),
	});
	console.log('R t2 =\n', t2Candidates[0]);
}

function getDirectorySizeList (branch) {
	let res = [branch.size];	
	for(let child of branch.children) {
		if(child.type === 'DIR') {
			res = res.concat(getDirectorySizeList(child));
		}
	}
	// console.log(`getDirectorySizeList: ${branch.name} => `, res);
	return res;

}

function computeAtMostSize (branch, limit) {
	let res = 0;
	if (branch.size <= limit) {
		res += branch.size;
	}
	for(let child of branch.children) {
		if(child.type === 'DIR') {
			res += computeAtMostSize(child, limit);
		}
	}
	return res;
}

function computeSize (branch) {
	if (branch.size === 0) {
		let size = 0;
		for (let child of branch.children) {
			size += computeSize(child);
		}
		branch.size = size
	}
	return branch.size
}

function printTree (tree, s = '') {
	const {name, type, size, children} = tree;
	console.log(`${s} - ${name} (${type}, size=${size})`);
	for(let child of children) {
		printTree(child, `\t${s}`);
	}
}

function getDirectory (element, dirName) {
	const dir = element.children.find(e => e.name === dirName);
	if (dir) {
		return dir;
	} 
	const newDir = getDir(dirName, element);
	element.children.push(newDir);
	return newDir;
}

function getDir (name, parent) {
	return {
		name,
		type: 'DIR',
		parent,
		children: [],
		size: 0
	};
}

function getFile (name, parent, size) {
	return {
		name,
		type: 'FILE',
		parent,
		children: [],
		size
	};
}