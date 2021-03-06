// SPDX-License-Identifier: RANDOM_TEXT
pragma solidity ^0.8.0;

// This is an ERC20PresetFixedSupply contract.
// This is used to create Richedu tokens RCED.
// This contract is deployed first.
// The contract address is given as the input parameter for deploying ERC721 contract.

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract Cybercafe is ERC20PresetFixedSupply {
    constructor(address deployerAddress)
        ERC20PresetFixedSupply(
            "Richedu",
            "RCED",
            10000000000000000000000000000, // 10 lakh tokens
            deployerAddress
        )
    {}
}
