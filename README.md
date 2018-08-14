# Ethereum-Transaction-Status

Ethereum-transaction-status.js extract Token Contract-metadata from the ethereum-blockchain by using the [etherscan api](https://github.com/sebs/etherscan-api).  
### Before Use
```javascript
//fetch-stats.js 
const Etherscan = require('etherscan-api').init('YourApiKey');
``` 
Update your getMeaningOfInput.js
```javascript
//getMeaningOfInput.js
case "60606040":
			return "ContractCreation"
``` 
It uses the 3-10 characters from the Input of the Transactions to identify the function. 
### Use
```javascript
node fetch-stats.js 'contractAddress'
```
### Parameters
#### Change The Startblock
```javascript
node fetch-stats.js 'contractAddress' 'startblock'
```
or  
```javascript
//fetch-stats.js 
var startblock = startblock;
```
#### Less Command line-Output
```javascript
node fetch-stats.js 'contractAddress' -no
```
or  
```javascript
node fetch-stats.js 'contractAddress' 'startblock' -no
```
### Savedata  
The collected data will be saved in ./data/saveFile.json
```javascript
fs.writeFileSync('./data/saveFile.json', json, 'utf8');
```
```javascript
//index.html
fetch('http://localhost:8080/data/saveFile.json').then(res => res.json()).then(prepareCharts)
```
### Presentation of Data 
satrt the local server
```javascript
npm run web
```
and open http://localhost:8080/index.html
