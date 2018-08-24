const abiToSignatureHash = require('eth-events-interface').abiToSignatureHash;
const brickblockTokenAbi = require('./BrickblockTokenAbi.json');

console.log(
    brickblockTokenAbi.map(
        abi => (abi.inputs == null) 
                    ? null 
                    : `(${abi.name}) : ${abiToSignatureHash(abi)}`
    )
)
