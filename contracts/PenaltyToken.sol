// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "./NonTransferableERC777Token.sol";

abstract contract PenaltyToken is NonTransferableERC777Token {
    constructor(
        address[] memory defaultOperators
    ) NonTransferableERC777Token("PenaltyToken", "PHBPE", defaultOperators) {}
}
