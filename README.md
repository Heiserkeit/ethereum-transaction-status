# Ethereum-Transaction-Status

Ethereum-transaction-status.js extract Token Contract-metadata from the ethereum-blockchain by using the [etherscan api](https://github.com/sebs/etherscan-api).

### Before Use

Set your etherscan API key

```javascript
// fetch-stats.js
const Etherscan = require('etherscan-api').init('YourApiKey')
```

Get the smart-contract ABI file, and update `utils/abi-reader` to read it; then run command

```javascript
npm run abi-reader
```

Update your getMeaningOfInput.js

```javascript
// getMeaningOfInput.js
case "60606040":
      return "ContractCreation"
```

Where the 8 character long hash is the function signature that will appear in transaction data.

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
// fetch-stats.js
var startblock = startblock
```

#### Less Commandline Output

```javascript
node fetch-stats.js 'contractAddress' -no
```

or

```javascript
node fetch-stats.js 'contractAddress' 'startblock' -no
```

### Save data

The collected data will be saved in ./data/saveFile.json

```javascript
fs.writeFileSync('./data/saveFile.json', json, 'utf8')
```

```javascript
// index.html
fetch('http://localhost:8080/data/saveFile.json')
  .then(res => res.json())
  .then(prepareCharts)
```

### Presentation of Data

Start the local server

```javascript
npm run web
```

and open http://localhost:8080/index.html
