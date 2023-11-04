// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "./NonTransferableERC777Token.sol";

contract ReputationToken is NonTransferableERC777Token {
    constructor(
        address[] memory defaultOperators
    ) NonTransferableERC777Token("ReputationToken", "PHBRP", defaultOperators) {}
}
