//fetch-stats.js 
const Etherscan = require('etherscan-api').init('YourApiKey');//YourApiKey
const getMeaningOfInput = require('./getMeaningOfInput.js').getMeaningOfInput;
var fs = require('fs');

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp * 1000);
	return a.toUTCString();
}

function calculateAvergage(dataMap) {
	var keys = Object.keys(dataMap);
	var values = Object.values(dataMap);
	var orderName;
	var gasTotalAmount;
	var countAmount;
	for (var c = 0; c < keys.length; c++) {
		if (keys[c].includes('gasAverage')) {
			orderName = keys[c].substring(0, keys[c].length - 10);
			gasTotalAmount = values[keys.indexOf(`${orderName}gasTotal`)];
			countAmount = values[keys.indexOf(`${orderName}count`)]
			dataMap[`${orderName}gasAverage`] = gasTotalAmount / countAmount
		};
	}
	return dataMap;
}

async function collect(startblock, address) {
	try {
		console.log('request started')
		const data = await Etherscan.account.txlist(address, startblock, 'latest', 'asc')//4994555
		console.log('request massage: ', data.message);
		//return [data.result,address];
		return data.result
	}
	catch (err) {
		console.log('request error: ', err);
		return err
	}
}

function creatLastBlockMap(txList, lastBlockNumber) {
	lastBlockHashMap = {};
	for (var i = txList.length - 1; i >= 0; i--) {
		if (txList[i].blockNumber != lastBlockNumber) {
			break
		}
		lastBlockHashMap[txList[i].hash] = false;
	}
	return lastBlockHashMap;
	//console.log(lastBlockHashMap)
}

function collectMetadata(txListMata, pointer, dataMapTotal) {
	var tempInput = '';
	var gas = 0
	dataMapTotal['count'] += 1;
	dataMapTotal['errorCount'] += parseInt(txListMata[pointer].isError);
	//gas calculation
	gas = txListMata[pointer].gasPrice * txListMata[pointer].gasUsed;
	if (dataMapTotal['gasHigh'] == 0) { dataMapTotal['gasHigh'] = gas };
	if (dataMapTotal['gasLow'] == 0) { dataMapTotal['gasLow'] = gas };
	if (dataMapTotal['gasHigh'] < gas) { dataMapTotal['gasHigh'] = gas }
	if (dataMapTotal['gasLow'] > gas) { dataMapTotal['gasLow'] = gas }
	dataMapTotal['gasTotal'] += gas;

	tempInput = getMeaningOfInput(txListMata[pointer].input.toString().substring(2, 10));

	if (`${tempInput} count` in dataMapTotal) {
		//dataMapTotal[tempInput] = dataMapTotal[getMeaningOfInput(tempInput)] + 1
		dataMapTotal[`${tempInput} count`] += 1;
		dataMapTotal[`${tempInput} errorCount`] += parseInt(txListMata[pointer].isError);
		dataMapTotal[`${tempInput} gasTotal`] += gas;
		if (dataMapTotal[`${tempInput} gasHigh`] < gas) { dataMapTotal[`${tempInput} gasHigh`] = gas }
		if (dataMapTotal[`${tempInput} gasLow`] > gas) { dataMapTotal[`${tempInput} gasLow`] = gas }
	} else {
		//dataMapTotal[tempInput] = 1;
		dataMapTotal[`${tempInput} count`] = 1;
		dataMapTotal[`${tempInput} errorCount`] = parseInt(txListMata[pointer].isError);
		dataMapTotal[`${tempInput} gasTotal`] = gas;
		dataMapTotal[`${tempInput} gasAverage`] = 0;
		dataMapTotal[`${tempInput} gasHigh`] = gas;
		dataMapTotal[`${tempInput} gasLow`] = gas;

	}
	return dataMapTotal;
}

function printMetadata(dataMapTotal) {
	var keys = Object.keys(dataMapTotal);
	var values = Object.values(dataMapTotal);
	var orderName;
	var gasTotalAmount;
	var countAmount;
	console.log();
	for (var c = 0; c < keys.length; c++) {
		if (keys[c].includes('gasAverage')) {
			//values[c]=values[c-1]/values[c-3]};
			orderName = keys[c].substring(0, keys[c].length - 10);
			gasTotalAmount = values[keys.indexOf(`${orderName}gasTotal`)];
			countAmount = values[keys.indexOf(`${orderName}count`)]
			values[c] = gasTotalAmount / countAmount
		};
		console.log(keys[c], ': ', values[c]);
		if (keys[c].includes('gasLow')) { console.log(); }
	}
	//console.log(JSON.stringify(dataMapTotal))
}

function testForAbort({ txList, dataMapTotal, lastBlockHashMap, dataMapDay, saveData, outputBool }) {
	var lastBockLength = 0;
	//txList = txList.concat(txList)
	//abort condition:
	if (txList == 'No transactions found' || txList == 'NOTOK' || txList.length == 0) {
		console.log('checheck your address or startblock')
		printMetadata(dataMapTotal)
		return true;
	}

	lastBockLength = Object.values(lastBlockHashMap).length;
	if (txList.length == lastBockLength) {
		console.log()
		console.log('search compiled')
		console.log()
		console.log(timeConverter(dataMapDay.date))
		//saveData.table.push(`UTC: ${timeConverter(dataMapDay.date)}`);
		saveData.table.push(calculateAvergage(dataMapDay));
		if (outputBool == true) { printMetadata(dataMapDay); }
		console.log('Total: ');
		//saveData.table.push('Total: ');
		saveData.table.push(calculateAvergage(dataMapTotal));
		printMetadata(dataMapTotal)
		return true;
	}

	return false;

}

async function dataProcessing({ txList, dataMapTotal, lastBlockHashMap, startblock: lastBlockNumber, dataMapDay, saveData, outputBool }) {
	//scanning the first block for already analyzed transaction
	var txCount = 0;
	while (txList[txCount].blockNumber == lastBlockNumber) {
		if (txList[txCount].hash in lastBlockHashMap) {
			lastBlockHashMap[txList[txCount].hash] = true;
		} else {
			//console.log('new Tx in the lastBock ', txList[txCount].hash);
			dataMapTotal = collectMetadata(txList, txCount, dataMapTotal)
			dataMapDay = collectMetadata(txList, txCount, dataMapDay);

		}
		txCount++
	}
	var lastBockLength = Object.values(lastBlockHashMap).length;
	console.log('new transactions receive: ', txList.length - lastBockLength);

	//console.log(timeConverter(txList[0].timeStamp))

	for (var i = txCount; i < txList.length; ++i) {
		dataMapTotal = collectMetadata(txList, i, dataMapTotal);
		if (txList[i].timeStamp > dataMapDay.date + 86400) {
			if (dataMapDay.count != 0) {
				if (outputBool == true) { console.log(await timeConverter(dataMapDay.date)) }
				//saveData.table.push(await timeConverter(dataMapDay.date));
				//saveData.table.push(`UTC: ${await timeConverter(dataMapDay.date)}`);
				saveData.table.push(calculateAvergage(dataMapDay));
				if (outputBool == true) { printMetadata(dataMapDay); }
				dataMapDay = {
					date: dataMapDay.date,
					count: 0,
					errorCount: 0,
					gasTotal: 0,
					gasAverage: 0,
					gasHigh: 0,
					gasLow: 0
				};
			}
			while (txList[i].timeStamp > dataMapDay.date + 86400) {
				dataMapDay.date += 86400;
			}
			dataMapDay = collectMetadata(txList, i, dataMapDay);
		} else {
			dataMapDay = collectMetadata(txList, i, dataMapDay);
		}
	}

	//console.log(txList);
	// lastBlockHashMap
	lastBlockNumber = txList[txList.length - 1].blockNumber;
	lastBlockHashMap = creatLastBlockMap(txList, lastBlockNumber);
	startblock = lastBlockNumber;

	return { startblock, dataMapTotal, lastBlockHashMap, dataMapDay, saveData }
}

async function main(address, collect) {
	var TIMESTAMPstart = Date.now();//Time
	var outputBool = true;
	var lastBlockHashMap = {}
	var dataMapTotal = {
		count: 0,
		errorCount: 0,
		gasTotal: 0,
		gasAverage: 0,
		gasHigh: 0,
		gasLow: 0
	}
	var dataMapDay = {
		date: 1517184000,
		count: 0,
		errorCount: 0,
		gasTotal: 0,
		gasAverage: 0,
		gasHigh: 0,
		gasLow: 0
	}

	var saveData = { table: [] };

	var startblock = 4994555;//4994555
	if (process.argv[3] != undefined && !isNaN(process.argv[3])) {
		startblock = process.argv[3];
	}
	console.log("As address", address)
	console.log("startblock", startblock)

	if (address == undefined) {
		console.log('no address was given')
		return
	}

	if (process.argv.includes('-no', 2)) {
		outputBool = false;
	}

	var defData = { startblock, dataMapTotal, lastBlockHashMap, dataMapDay, saveData, outputBool };

	while (true) {
		defData.txList = await collect(defData.startblock, address);
		//console.log(defData)
		if (await testForAbort(defData)) { break };
		defData = await dataProcessing(defData)
	}
	console.log('run-time: ', Date.now() - TIMESTAMPstart, 'ms')//Time

	var json = JSON.stringify(saveData);
	try {
		if (!fs.existsSync('./data')) {
			fs.mkdirSync('./data')
		}
		fs.writeFileSync('./data/saveFile.json', json, 'utf8');
	} catch (err) {
		console.log(err)
	}

	return { dataMapTotal, saveData };
}

const address = process.argv[2];

main(address, collect);



module.exports = { main, dataProcessing, printMetadata, collectMetadata, creatLastBlockMap, getMeaningOfInput, collect, testForAbort, calculateAvergage };
