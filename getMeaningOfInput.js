//getMeaningOfInput.js

function getMeaningOfInput(Input) {
	switch (Input) {
        // used function
		case "":
			return "empty"
		case "60606040":
			return "ContractCreation"
		case "ee61873c":
			return "distributeBonusTokens"
		case "158a4988":
			return "distributeTokens"
		case "a9059cbb":
			return "transfer"
		case "095ea7b3":
			return "approve"
		case "3f4ba83a":
			return "unpause"
		case "8456cb59":
            return "pause"
        //unused function
		case "06fdde03":
			return "name"
		case "0f40988e":
			return "contributorsShare"
		case "18160ddd":
			return "totalSupply"
		case "23b872dd":
			return "transferFrom"
		case "313ce567":
			return "decimals"
		case "36cf7c87":
			return "dead"
		case "378dc3dc":
			return "initialSupply"
		case "54e030b7":
			return "bonusDistributionAddress"
		case "5acb053b":
			return "toggleDead"
		case "5c975abb":
			return "paused"
		case "66188463":
			return "decreaseApproval"
		case "70a08231":
			return "balanceOf"
		case "7693488b":
			return "finalizeTokenSale"
		case "76ba242c":
			return "bonusTokens"
		case "835e98d7":
			return "bonusShare"
		case "8c9512bc":
			return "companyTokens"
		case "8da5cb5b":
			return "owner"
		case "95d89b41":
			return "symbol"
		case "b762fbac":
			return "changeFountainContractAddress"
		case "d65a4184":
			return "tokenSaleActive"
		case "d73dd623":
			return "increaseApproval"
		case "dd62ed3e":
			return "allowance"
		case "e5e75fee":
			return "fountainContractAddress"
		case "efa08854":
			return "companyShare"
		case "f2fde38b":
            return "transferOwnership"
        //unused event
        case "88495b5f"://0x88495b5f0a8bf35ed3699f8b402f3b01d6028d68027530641454caac9f29a964
            return "undefined"
        case "1e0f6ed8"://0x1e0f6ed836d97ca730b1869fb9fe494aeb75dccb640606a1384df9ddb1cf343f
            return "TokenSaleFinished"
        case "cc16f5db"://0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5
            return "Burn"
        case "6985a022"://0x6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff625
            return "Pause"
        case "7805862f"://0x7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b33
            return "Unpause"
        case "8be0079c"://0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0
            return "OwnershipTransferred"
        case "8c5be1e5"://0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925
            return "Approval"
        case "ddf252ad"://0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
            return "Transfer"
		default:
			return Input
	}
}


module.exports = { getMeaningOfInput};