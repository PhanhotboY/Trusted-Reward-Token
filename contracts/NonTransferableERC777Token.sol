// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "./ModifiedERC777.sol";

abstract contract NonTransferableERC777Token is ModifiedERC777 {
    constructor(
        string memory _name,
        string memory symbol,
        address[] memory defaultOperators
    ) ModifiedERC777(_name, symbol, defaultOperators) {}
}
